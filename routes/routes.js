const express = require('express');
const router = express.Router();


//handling all routes manipulating employees
router.get('/employees', (req, res) => {
    res.send("All Employees");
});

module.exports = router;