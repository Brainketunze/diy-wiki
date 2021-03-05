'use strict';

// require built-in dependencies
const path = require('path');

const util = require('util'); // The util module supports the needs of Node.js internal APIs. Many of the utilities are useful for application and module developers as well
const fs = require('fs');

const readFile = util.promisify(fs.readFile); //equivalently using async functions
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

// require express-related dependencies
const express = require('express');
const cors = require('cors'); //Cross Origin Resource Sharing,  CORS essentially means cross-domain requests.
const bodyParser = require('body-parser');

// require local dependencies
const logger = require('./middleware/logger');

// declare local constants and helper functions
const PORT = process.env.PORT || 4600;

const DATA_DIR = 'data';
const TAG_RE = /#\w+/g;
const slugToPath = (slug) => {
  const filename = `${slug}.md`;
  return path.join(DATA_DIR, filename); //Returns: '/data/x.md => https://nodejs.org/api/path.html#path_path_join_paths
};

// initialize express app
const app = express();

// use middlewares
app.use(cors());
app.use(logger);
app.use(bodyParser.json());
// this commented line of code will statically serve the frontend
// it will not work until you:
// $ cd client
// $ yarn install
// $ yarn build
app.use('/', express.static(path.join(__dirname, 'client', 'build')));

// GET: '/api/page/:slug'
// success response: {status: 'ok', body: '<file contents>'}
// failure response: {status: 'error', message: 'Page does not exist.'}
app.get('/api/page/:slug', async (req, res) => {
  const filename = slugToPath(req.params.slug);
  try {
    // console.log('File start to read', file);
    //await fs.writeFile('filename.txt', 'test');
    const body = await readFile(filename, 'utf-8');
    res.json({ status: 'ok', body });
    // return jsonOK(res, { body });
  } catch (e) {
    res.json({ status: 'error', message: 'Page does not exist.' });
    // return jsonError(res, 'Page does not exist.');
  }
});

// POST: '/api/page/:slug'
//  body: {body: '<file text content>'}
// tries to write the body to the given file
//  success response: {status: 'ok'}
//  failure response: {status: 'error', message: 'Could not write page.'}
app.post('/api/page/:slug', async (req, res) => {
  const filename = slugToPath(req.params.slug);
  try {
    // read request body which still is not file
    const text = req.body;
    // write current change to in file
    await writeFile(filename, text.body);

    console.log('Files has been changed', text);
    res.json({ status: 'ok', text });
    //res.json({ status: 'ok', text });
  } catch (e) {
    res.json({ status: 'error', message: 'Could not write page' });
  }
});

// GET: '/api/pages/all'
// sends an array of all file names in the DATA_DIR
// file names do not have .md, just the name!
//  success response: {status:'ok', pages: ['fileName', 'otherFileName']}
//  failure response: no failure response
app.get('/api/pages/all', async (req, res) => {
  // first read all files name
  const pathOfData = __dirname + '/' + DATA_DIR;
  const readDirectory = await readDir(pathOfData);
  // remove .md from files name
  const removedMd = [];

  readDirectory.forEach((element) => {
    removedMd.push(element.replace('.md', ''));
  });
  res.json({ status: 'ok', pages: removedMd });
});

// GET: '/api/tags/all'
// sends an array of all tag names in all files, without duplicates!
// tags are any word in all documents with a # in front of it
// hint: use the TAG_RE regular expression to search the contents of each file
//  success response: {status:'ok', tags: ['tagName', 'otherTagName']}
//  failure response: no failure response
app.get('/api/tags/all', async (req, res) => {
  var newArr = [];
  let allFilesArr = await readDir('./' + DATA_DIR);

  async function readAsync(arr) {
    for (let i = 0; i < arr.length; i++) {
      let path = `./data/${arr[i]}`;
      let readEach = await readFile(path, 'UTF-8');
      // console.log('ReadEach: ', readEach);
      let arrHash = readEach.match(TAG_RE);
      if (arrHash !== null) {
        for (let e = 0; e < arrHash.length; e++) {
          // console.log('readEach tag: ', arrHash[e]);
          newArr.push(arrHash[e]);
        }
      }
    }
  }
  let runFunc = await readAsync(allFilesArr);
  // remove the "#" character because the React program pushes an extra "#" as well
  let noHash = [];
  console.log('tags arr: ', newArr);
  newArr.forEach((item) => {
    noHash.push(item.replace('#', ''));
  });
  // remove duplicates
  for (let i = 0; i < noHash.length; i++) {
    for (let j = i + 1; j < noHash.length; j++) {
      if (noHash[i] == noHash[j]) {
        noHash.splice(j, 1);
      }
    }
  }
  console.log('nohash: ', noHash);
  res.json({ status: 'ok', tags: noHash });
});


// GET: '/api/tags/:tag'
// searches through the contents of each file looking for the :tag
// it will send an array of all file names that contain this tag (without .md!)
//  success response: {status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}
//  failure response: no failure response
app.get('/api/tags/:tag', async (req, res) => {
  const tagName = req.params.tag;
  // first read all files
  const pathOfData = __dirname + '/' + DATA_DIR;
  const readDirectory = await readDir(pathOfData);

  // loop over files and if tag exist then show its file
  let tag = '';
  let pages = [];
  readDirectory.forEach((file) => {
    const filePath = __dirname + '/' + DATA_DIR + '/' + file;

    const body = fs.readFileSync(filePath, 'utf-8');
    const findTags = body.match('#' + tagName);
    if (findTags) {
      // if tag exist write its page name
      tag = tagName;
      pages.push(file.replace('.md', ''));
    }
  });
  res.json({ status: 'ok', tag: tag, pages: pages });
});

// this needs to be here for the frontend to create new wiki pages
//  if the route is not one from above
//  it assumes the user is creating a new page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Wiki app is serving at http://localhost:${PORT}`);
});
