# TheOdinProject-Backend-MessageApp

This project follows the specifications within the curriculum of The Odin Project 
https://www.theodinproject.com/lessons/nodejs-messaging-app


Node.js Express API with Prisma ORM
-----------------------------------

A backend was developed using Node.js, with the Express framework for handling HTTP requests and responses, and Prisma as the ORM for managing database interactions.

functionality
-------------
The app includes the following core functionality:

### Authorization ###

- A sign up route for create users. The server uses Express-Validator to validate data input in the sign-up route and Prisma to ensure no duplicate values by enforcing constraints.
- The password is stored as a hash using the bcryptjs library, ensuring it is securely encrypted and not stored in plain text.
- A login route handled with Passport.js that grants a jwt token for 1 day
- A login as guest route that creates a guest user to view limited content

### Middlewares for Token Validation and User Check ###
Middleware functions was used in several routes to handle requests, in order to validate tokens and check if a user is authenticated, a guest, or a regular user.

### Sending messages to another user ###

- Each user can create chats to write message with another user. 
- Only members of each chat can write and view messages within the chat.
- Users can see the profiles of the other chat members.
- Because the REST API backend cannot handle real time updates, a button was created inside the chat component to refresh the data.

### Customizing a user profile ###

- Users will be able to customize their profiles.
- The available avatars and colors are limited to a few options stored in the database.

### Guest mode access ###

The app can be accessed in guest mode and in this way it will be possible:
- have a token for one day.
- be able to see the chat model.
- be able to see the profiles of the users of the chat model.
- guest can customize their profiles.
- guests will not be able to start a new chat or write messages.

### Access ###

This server is accessed through HTTP requests made from a frontend designed in React.<br>
The url frontend address is https://whitedove.netlify.app
<br>
The url of the backend is https://top-backend-messagesapp.onrender.com 

### Repositories ###
Backend: https://github.com/manelly67/TheOdinProject-Backend-MessagesApp <br>
Frontend: https://github.com/manelly67/TheOdinProject-Frontend-MessageApp

#### Credits: ####
The avatars archived in the database were half created by chatGpt and half obtained from the web as public domain.
<br>
The image are hosted in Cloudinary.com
<br>
The server is hosted in render.com
<br>
The database is hosted in neon.tech
<br>