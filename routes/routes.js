const express = require("express");
const router = express.Router();

//handling all routes manipulating employees
router.get("/", (req, res) => {
    const templateVars = {title: 'Home Page'};
  res.render('index', templateVars);
});

module.exports = router;
