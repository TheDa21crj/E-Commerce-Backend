const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.status(202).send("Hello World");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
