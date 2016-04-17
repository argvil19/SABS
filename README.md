# Simple Angular Blog System

A simple blog system made in the MEAN stack (MongoDB, Express, Angular, NodeJS). Built as a practice project, but i want to share the code.

As a user (userLevel = 1), you can comment and vote in posts. 

As admin (userLevel = 2), you can create, edit and delete posts. Also, you can delete individual comments. 

## INSTALATION

In order to use SABS, you must have a MongoDB instance running. You must edite dbconfig/config.js to point to your Mongo path.

Create the ```users``` and ```entries``` collections in MongoDB.

After configuring your DB path, install dependencies with ```npm install``` and start node with ```npm start```

The user admin is the first user registered.