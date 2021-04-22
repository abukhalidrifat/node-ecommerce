const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        const error = new Error("Email already taken. Please try another one.");
        error.statusCode = 422;
        throw error;
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPwd) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPwd,
          });
          return user.save();
        })
        .then((result) => {
          res.status(201).json({
            message: "User create successfully",
            result: result,
          });
        });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let expiryTime = "1";
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user found!");
        error.statusCode = 404;
        throw error;
      }
      const { name, email, role } = user;
      loadedUser = { name, email, role };
      return bcrypt.compare(password, user.password);
    })
    .then((doMatch) => {
      if (!doMatch) {
        const error = new Error("Password does not match.");
        error.statusCode = 422;
        throw error;
      }
      const token = jwt.sign(
        {
          userID: loadedUser._id,
          role: loadedUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: expiryTime + "h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: expiryTime,
        user: loadedUser,
        message: "Successfully logged in!",
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
