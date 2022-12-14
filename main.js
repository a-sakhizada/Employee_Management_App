//imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

//database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database"));

//middleware
app.use(bodyParser.urlencoded({ extended: true })); //translates/parses incoming req body
app.use(express.json());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
); //initialize express session

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
}); //storing session msg

//make the uploads folder static
app.use(express.static("uploads"));

//set the template engine
app.set("view engine", "ejs");

//endpoints
// app.get("/", (req, res) => {
//   res.send("hi");
// });

//route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
