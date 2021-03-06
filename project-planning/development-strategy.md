# Diy Wiki Project

Practicing more about server side programming with Node JS and Express JS

- A simplified wiki to create, read and update pages in a markdown wiki.

- Most of the code is already written.

- The task is to write the piece between the server and the file system like reading, writing and updating saved files in the PC.

- There are five routes in this project:
  
  - Get an existing page
  - Post a new page
  - Get all page names
  - Get all tags
  - Get page names by tag

  ---

## 0.Setup

**A User can see the initial repository** 

### Repository

- Forked from this [diy-wiki repository](https://github.com/hackyourfuturebelgium/diy-wiki)
- Clone the repository
- Start the development strategy
- turn on Github page
- install dependencies on the terminal
- play with the server and demo to understand the tasks in vsc
- Push the changes to GitHub

---

## 1.Get an Existing Page

**As a user I want to be able to view the content of a specific existing page**

### REPO

- This user story has been written by Coaches.
- This user story is developed on branch `get-page`.
- This branch is merged to `master` branch after completion.

### Node.js

- _method_: GET
- _path_: `"/api/page/:slug"`
- _success response_: `{status: 'ok', body: '<file contents>'}`
- _failure response_: `{status: 'error', message: 'Page does not exist.'}`

---

## 2.Post a New Page

**As a User I want to be able to create a new page**

### REPO

- This user story is developed on branch `add-page`.
- This branch is merged to `master` branch after completion.

### Node.js

- _method_: POST
- _path_: `"/api/page/:slug"`
- _body_: `{body: '<file content>'}`
- _success response_: `{status: 'ok'}`
- _failure response_: `{status: 'error', message: 'Could not write page.'}`

---

## 3.Get All Page Names

**As a user I want to be able to view all page names**

### REPO

- This user story is developed on branch `get-all-pages`.
- This branch is merged to `master` branch after completion.

### Node.js

- _method_: GET
- _path_: `"/api/page/all"`
- _success response_: `{status:'ok', pages: ['fileName', 'otherFileName']}`
- _failure response_: (none)

---

## 4.Get All tags

**As a user I want to be able to view all tags(all words preceded by #)**

This part is done in a branch called `get-all-tags`

This branch is merged to the master after is was completed

### Node.js

- _method_: GET
- _path_: `"/api/tags/all"`
- _success response_: `{status:'ok', tags: ['tagName', 'otherTagName']}`
- _failure response_: (none)

---

## 5.Get Page Names by Tag

**As a user I want to be able to list all pages that contain a specific tag**

### REPO

- This user story is developed on branch `get-pages-by-tag`.
- This branch is merged to `master` branch after completion.

### Node.js

- _method_: GET
- _path_: `"/api/tags/:tag"`
- _success response_: `{status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}`
- _failure response_: (none)