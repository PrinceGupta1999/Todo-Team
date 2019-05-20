
# Todo Team

  

**This github repository represents the submission by Prince Gupta for NSUT Web Team shortlisting task**. Todo Team is a To'do management MERN Stack based web-app that allows users to create and manage their To'do’s in a collaborative fashion allowing them to create multiple To'do Lists and inviting other users to edit or view the same

## Demo Screenshots

***Home Page***

![demo1](https://github.com/PrinceGupta1999/Todo-Team/blob/master/screenshots/home.png)

  
  

***Dashboard***

![demo2](https://github.com/PrinceGupta1999/Todo-Team/blob/master/screenshots/dashboard.png)

  
  

***Create and View To'dos***

![demo3](https://github.com/PrinceGupta1999/Todo-Team/blob/master/screenshots/todo.png)

  
  

***Accept/Decline Notification***

![demo4](https://github.com/PrinceGupta1999/Todo-Team/blob/master/screenshots/notification.png)

  
## Installation

  

### Install Git

* Follow instructions from [Git Website](https://git-scm.com/downloads)

  

### Install NodeJs and NPM

* Follow instructions from [NodeJs Website](https://nodejs.org/en/download/)

    
### Cloning Repository and Installation

* Open Command Prompt in the Directory You Want to Install.

* Clone the Repository

```bash

git clone https://github.com/PrinceGupta1999/Todo-Team.git

```

* Change working Directory to the Repository

```bash

cd Todo-Team

```

* Install Dependencies

```bash

npm install && npm run client-install && npm install -g nodemon

```
 * Change Configuration Files: Edit following files
 1. config/default.json: Change ***secretOrKey*** and ***mongoURI***
 2. client/package.json: change **proxy**
 3. client/App.js: Change ***socketIOClient()*** call

* Initiate the Application
```bash

npm run dev

```

* Access the [Application](http://localhost:3000)

  

### Technology Stack

* NodeJS

* ExpressJS

* ReactJs

* MongoDB

* Material-UI  

## Features

#### Java Web Token Authentication

Uses **JWT** tokens along with **Passport.Js** for user authentication during all API calls to provide Token based Authentication.

#### Socket.IO

Uses Socket.IO library for broadcasting Real-Time Database operations results to all eligible users and updating UI accordingly

#### Material-UI

Employs Material-UI framework for providing consistent and responsive  front-end experience