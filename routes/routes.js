const express = require("express");
const router = express.Router();
const Employee = require("../models/employees"); //require the employee schema
const multer = require("multer"); //processes files that are uploaded
const fs = require("fs");

//file upload
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("file");

//const upload = multer({dest: "./uploads"}).single("file");

//handling all routes manipulating employees
//get the add employee modal
router.get("/add", (req, res) => {
  const templateVars = { title: "Add Employees" };
  res.render("add_employees", templateVars);
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
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Employee added successfully!",
      };
      res.redirect("/");
    }
  });
});

// get all employees
router.get("/", (req, res) => {
  Employee.find().exec((err, employees) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      //console.log("employees obj:", employees);
      res.render("index", {
        title: "Home Page",
        employees: employees,
      });
    }
  });
});

//edit employee page
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Employee.findById(id, (err, employee) => {
    if (err) {
      res.redirect("/");
    } else {
      if (employee == null) {
        res.redirect("/");
      } else {
        res.render("edit_employees", {
          title: "Edit Employees",
          employee: employee,
        });
      }
    }
  });
});

//update employee
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_file = "";

  if (req.file) {
    new_file = req.file.filename;
    try {
      fs.unlinkSync("./uploads" + req.body.old_file);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_file = req.body.old_file;
  }

  //get all other employee details
  Employee.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      employeeStatus: req.body.employeeStatus,
      file: new_file,
    },
    (err) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Employee updated successfully!",
        };
        res.redirect("/");
      }
    }
  );
});

//delete user
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Employee.findByIdAndDelete(id, (err, result) => {
    if (result.file != "") {
      try {
        fs.unlinkSync("./uploads/" + result.file);
      } catch (err) {
        console.log(err);
      }
    }

    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "Employee deleted successfully!",
      };
      res.redirect("/");
    }
  });
});

module.exports = router;
