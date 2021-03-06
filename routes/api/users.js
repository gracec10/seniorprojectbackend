const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// GET user by id
router.get('/id/:id', (req, res) => {
  const id = req.params.id
  User.findById(id).then(founduser => {
    res.json(founduser)
  })
  .catch(err => console.log(err))
})

// GET user by email
router.get('/:email', (req, res) => {
  const email = req.params.email 
  User.findOne({ email })
    .then(user => res.json(user))
    .catch(err => console.log(err))
})

// Insert user into project
router.post('/:email', (req, res) => {
  Project.findById(req.body.projectID).then(foundproject => {
    const email = req.params.email 
    const access = req.body.access
    User.findOne({ email })
      .then(user => {
        res.json(user)
        if (access == "Admin") foundproject.adminIDs.push(user)
        else foundproject.researcherIDs.push(user)
      })
      .then(_ => foundproject.save())
      .catch(err => console.log(err))
  })
})

//GETTING ONE USER AND UPDATING IT
router.put('/:id', (req, res) => {
  if (jwtDecode(req.headers.authorization).id === req.params.id) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))
      }
    )
      .then(updatedUser => {
        res.json(updatedUser)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    res.sendStatus(401)
  }
})

module.exports = router;