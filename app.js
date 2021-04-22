const express = require("express");
require('dotenv').config();
const cors = require('cors');
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

// headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
module.exports = upload;

app.use(cors());
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: false }));
app.use('/uploads',express.static(path.join(__dirname, "uploads")));

// Routers
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/admin',adminRoutes);
app.use(productRoutes);
app.use('/auth',authRoutes);

// error middleware
app.use((error, req, res, next) =>{
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
    res.status(status).json({
      message:message,
      data:data
    })
});

const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, err => {console.log(err);});
  })
  .catch((err) => {
    console.log(err);
  });
