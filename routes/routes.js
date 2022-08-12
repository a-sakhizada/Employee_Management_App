const express = require("express");
const router = express.Router();
const Employee = require('../models/employees'); //require the employee schema
const multer = require("multer");  //processes files that are uploaded

//file upload
let storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
//   filename:  function (req, file, cb) { 
//     cb(null , file.originalname);   
//  },
});

let upload = multer({
  storage: storage,
}).single("file");

//const upload = multer({dest: "./uploads"}).single("file");

//handling all routes manipulating employees
// router.get("/", (req, res) => {
//     const templateVars = {title: 'Home Page'};
//   res.render('index', templateVars);
// });

router.get("/add", (req, res) => {
    const templateVars = {title: 'Add Employees'};
  res.render('add_employees', templateVars);
});

//add an employee to the db
router.post("/add", upload, (req, res) => {
  const employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
    employeeStatus: req.body.employeeStatus,
    file: req.file.filename,
  });
  employee.save((err) => {
    if(err){
      res.json({message: err.message, type: 'danger'});
    }else{
      req.session.message = {
        type: 'success',
        message: 'Employee added successfully!'
      };
      res.redirect('/');
    }
  });

});

// get all employees
router.get('/', (req, res) => {
  Employee.find().exec((err, employees) => {
    if(err){
      res.json({ message: err.message });
    }else {
      console.log("employees obj:", employees);
      res.render('index', {
        title: "Home Page",
        employees: employees,
      })
    }
  });
});


module.exports = router;
