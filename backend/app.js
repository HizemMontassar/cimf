const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { resolveSanitizationFn } = require('@angular/compiler/src/render3/view/template');

const employeRoutes = require('./routes/employe');
const congeRoutes = require('./routes/conge');
const directionRoutes = require('./routes/direction');
const administrationRoutes = require('./routes/administration');

const app = express();

/*mongoose.connect("mongodb+srv://hazerforta:La7ad4you505@cluster0.y3nh1.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(()=>{
  console.log('Connected to database!');
})
.catch(()=>{
  console.log('Connection failed!');
});*/

mongoose.connect("mongodb://localhost:27017/CIMF")
.then(()=>{
  console.log('Connected to database!');
})
.catch(()=>{
  console.log('Connection failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use('/api/employe', employeRoutes);
app.use('/api/conge', congeRoutes);
app.use('/api/direction', directionRoutes);
app.use('/api/administration', administrationRoutes);
module.exports = app;
