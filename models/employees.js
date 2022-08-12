const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  employeeStatus: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Employees", userSchema);
