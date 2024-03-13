const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

// convert data into jason format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// app.get("/forget", (req, res) => {
//   res.render("forgot-password"); // Assuming you have an EJS file for your forgot password page
// });

// app.use((req, res) => {
//   res.status(404).send("404 Not Found");
// });
// Register User
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
    phonenumber: req.body.phonenumber,
    email: req.body.email
  };
  const existingUser = await collection.findOne({ name: data.name });

  if (existingUser) {
    res.send("User already exists. Please choose a different username");
  } else {
    // hash the password using bcrypt
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashPassword;

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username.trim() });
        if (!check) {
            res.send("user name cannot be found");
        } else {
            // compare the hash password from the database with the plain text
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                res.render("home");
            } else {
                res.send("wrong password");
            }
        }
      } catch (error) {
        console.error(error);
        res.send("Wrong details");
      }
});


// app.post("/forgot-username", async (req, res) => {    
//   try {
//     const user = await collection.findOne({ email: req.body.email });

//     if (user) {
//       res.send(`Your username is: ${user.name}`);
//     } else {
//       res.send("User not found. Check your email and try again.");
//     }
//   } catch (error) {
//     console.error(error);
//     res.send("Error retrieving username. Please try again later.");
//   }
// });

// // Route for handling forgotten password
// app.post("/forgot-password", async (req, res) => {
//   try {
//     const user = await collection.findOne({ name: req.body.username });

//     if (user) {
//       // Implement your logic for sending a password recovery email or other recovery method.
//       // For simplicity, we'll just send the hashed password in this example.
//       res.send(`Your hashed password is: ${user.password}`);
//     } else {
//       res.send("User not found. Check your username and try again.");
//     }
//   } catch (error) {
//     console.error(error);
//     res.send("Error retrieving password. Please try again later.");
//   }
// });

const port = 5000;
app.listen(port, () => {
  console.log(`server is runniing on Port : ${port}`);
});
