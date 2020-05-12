const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const projects = require("./routes/api/projects")
const questions = require("./routes/api/questions")
const images = require("./routes/api/images")

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useUnifiedTopology: true,
      useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes for the frontend to access
app.use("/api/users", users);
app.use("/api/projects", projects);
app.use("/api/questions", questions);
app.use("/api/images", images);


const port = process.env.PORT || 5000; // process.env.port is Heroku's port

app.listen(port, () => console.log(`Server up and running on port ${port} !`));