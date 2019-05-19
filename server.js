const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require('config');
const users = require("./routes/api/users");
const todoLists = require("./routes/api/todoLists");
const notifications = require("./routes/api/notifications");
const socket = require("socket.io");

const app = express();

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// DB Config
const db = config.get('mongoURI');

// Connect to MongoDB
mongoose
    .connect(
        db,
        {
            useFindAndModify: false,
            useNewUrlParser: true
        }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/todolists", todoLists.router);
app.use("/api/notifications", notifications.router);

const port = process.env.PORT || 5000;

const io = socket(app.listen(port, () => console.log(`Server up and running on port ${port} !`)));

// Use socket.io for state management of clients
io.on('connection', client => {
    // Manage TodoLists
    todoLists.io(io, client);

    // Set Up Personal Events if Required
})