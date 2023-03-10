// following is the es modules declaration style in nodejs
import express from "express";
import path from "path";

// import products from "./data/"
// const express = require('express')
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import items from './data/Data.js'
import Dashboard from "./models/dashboardModel.js";
// import classes from './data/ClassData.js'
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import uploadRouter from "./routes/uploadRoute.js";
// const items = require('./data/Data')
// const classes = require('./data/ClassData')
// d0t
dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.get("/dashboard", async (req, res) => {
  const items = await Dashboard.find();
  console.log(items);
  res.json(items);
});

app.use("/api/students", studentRoutes);
app.use("/api/login", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/staffs", staffRoutes);
app.use("api/upload", uploadRouter);
app.get("/api/config/cloudinary", (req, res) => {
  res.send(process.env.CLOUDINARY_URL);
});
app.get("/api/config/cloudinarypreset", (req, res) => {
  res.send(process.env.CLOUDINARY_UPLOAD_PRESET);
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

//the following router is for displaying the class labels

//following route is for displaying the list of students
//according to the classses

//following route will only be used in case the error is encountered.
//FOLLOWING IS THE FALL BACK ROUTE for url not listed in the backend folder
app.use((req, res, next) => {
  const error = new Error(`Not found -${req.originalUrl}`);
  res.status(404);
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
