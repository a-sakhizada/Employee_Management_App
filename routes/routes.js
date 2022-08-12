const express = require("express");
const router = express.Router();

//handling all routes manipulating employees
router.get("/", (req, res) => {
    const templateVars = {title: 'Home Page'};
  res.render('index', templateVars);
});

router.get("/add", (req, res) => {
    const templateVars = {title: 'Add Employees'};
  res.render('add_employees', templateVars);
});


module.exports = router;
