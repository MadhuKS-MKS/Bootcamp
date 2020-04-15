const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//Route files
const auth = require("./routes/auth");
const users = require("./routes/users");
const category = require("./routes/category");
const course = require("./routes/course");

//initialize app with express
const app = express();

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Access data from req.body
app.use(bodyParser.json());

//Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/category", category);
app.use("/api/v1/course", course);

app.use(errorHandler);

// server side port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

// handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error :${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
