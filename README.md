# Board Game Inventory
This is a simple Inventory website built using NodeJS, the Express framework, and MongoDB

## Table of Contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Create a inventory site for board games. The inventory is tracked in a MongoDB database hosted on MongoDB Atlas. The user should be able to take CRUD operations on all entries in the database.

### Screenshot

![image](https://github.com/singhalex/boardgame-inventory/assets/115970252/7ebc12e9-8109-4a2b-b832-4c20f0dc6b31)

## Links

- [Live Site](https://relieved-verbena-path.glitch.me/inventory/game/65e22487634b1f58529f72d9)


## My process

### Built with

- NodeJS
- Express
- PUG
- MongoDB
- Mongoose

### What I learned

I learned how to initialize an Express app, set up routes, handle user submitted data, and interact with a database.

The app is broken down into 4 major components.
- Models: define what a MongoDB collection looks like. Lives as an object within the code that can be used to define new entries or to query existing entries in the database
- Router: this handles requests from the user by parsing the url and the associated method. Based on the request, the router responds with the appropriate actions
- Controllers: these are called by the router and handle the logic of the user's request. This varies from simply rendering a page to creating a new entry opbject and saving it to the database
- View: using the PUG templating language, HTML pages are rendered with the appropriate data requested by the user

### Continued development

I would like to add an upload functionality so that users can upload photos to the database rather than link to an external source. I would also like to add some sort of verification system to ensure that items cannot be deleted without authorization.

### Useful resources

- [MDN Guide](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Designing_the_LocalLibrary_models) - This was a very useful guide and was heavily refernced for my project. It goes through the process of setting up an Express application, adding relevant dependancies, and deploying to a cloud provider
- [Express Validator Docs](https://express-validator.github.io/docs/) - Helpful for understanding the variouse ways user submitted data could be formatted and sanitized before processing
- [Express Async Handler](https://www.npmjs.com/package/express-async-handler) - A useful package that reduces the boilerplate code needed to handle errors in async functions
- [MongoDB University](https://learn.mongodb.com/) - Lots of good information about interacting with a MongoDB database

## Author

- Website - [Github](https://github.com/singhalex)
- LinkedIn - [Alex Singh]https://www.linkedin.com/in/alex-singh-748000254/)
