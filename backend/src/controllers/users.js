import { Router } from "express";
import bcrypt from "bcryptjs";
import express from "express";
import * as Users from "../models/users.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import auth from "../middleware/auth.js";
import verifyToken from "../middleware/verifyToken.js"
import { blacklist } from '../middleware/checkTokenBlacklisted.js';


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userController = express.Router();

// Route to render login page (for testing or redirection purposes)
userController.get("/login", (req, res) => {
  res.json({ message: "Login page" });
});

userController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("email and password is " + email + ' ' +password)
  try {
    const loggedUser = await Users.getByEmailAddress(email);
    // console.log("The logged user is:", loggedUser)
    if (bcrypt.compareSync(password, loggedUser.password)) {
      const token = jwt.sign(
        {
          userID: loggedUser.id,
          role: loggedUser.role,
          firstName: loggedUser.firstname,
          lastName: loggedUser.lastname
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const userWithToken = {
        id: loggedUser.id,
        role: loggedUser.role,
        firstName: loggedUser.firstname,
        token: token
      }

      // console.log("token is: ", token)

      res.json({ message: "Login Successful", user: userWithToken, token });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    res.status(404).json({ message: "User not found", error });
  }
});

// Endpoint to get user details by token
// userController.get('/my-profile', auth(["admin", "trainer", "member"]), async (req, res) => {
  
//   try {
//       const user = await Users.getByID(req.user.userID); 
//       console.log("The user in the get request is", user)// Retrieve user based on token
//       res.status(200).json({ user });
//   } catch (error) {
//       res.status(500).json({ message: 'Server error', error });
//   }
// });

// userController.get('/my-profile', auth(["admin", "trainer", "member"]), async (req, res) => {
//   try {
//     // Check if req.user.userID is available
//     if (!req.user || !req.user.userID) {
//       return res.status(400).json({ message: 'User ID not found in request' });
//     }

//     // Fetch user from the database
//     const user = await Users.getById(req.user.userID);
//     console.log("the Logged in user in the get request is: ", user)

//     // Check if user exists
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Respond with user data
//     res.status(200).json({ user });
//   } catch (error) {
//     // Log the error
//     console.error('Error in /my-profile route:', error);

//     // Send error response
//     res.status(500).json({ message: 'Server error', error: error.message || error });
//   }
// });



// // Route to handle logout
// userController.get("/logout", (req, res) => {
//   //One the client side, delete the token from storage
//   res.json({ message: "Logged out", redirect: "/" });
// });

// userController.post("/logout", (req, res) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1]; // Extract token from header
    
//     if (token) {
//       // Optionally, you could store the token in a blacklist
//       blacklist.add(token);

//       res.status(200).json({ message: "Logged out successfully", redirect: "/" });
//     } else {
//       res.status(400).json({ message: "No token provided" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });


// Route to render signup page (for testing or redirection purposes)
userController.get("/register", (req, res) => {
  res.json({ message: "Signup page" });
});

// Route to handle signup
// userController.post("/register", async (req, res) => {
//   const formData = req.body;
//   const {
//     email,
//     password,
//     phoneNumber,
//     firstName,
//     lastName,
//     unitNumber,
//     streetNumber,
//     streetName,
//     streetType,
//     suburb,
//     postcode,
//   } = formData;

//   console.log("formData is: ", formData)

//   // Validate inputs
//   if (!validator.isEmail(email)) {
//     return res.status(400).json({ message: "Invalid email" });
//   }

//   if (
//     !validator.isLength(password, { min: 6 }) ||
//     !validator.isAlphanumeric(password)
//   ) {
//     return res.status(400).json({ message: "Invalid password" });
//   }

//   if (!/^04\d{8}$/.test(phoneNumber)) {
    
//     return res.status(400).json({ message: "Invalid phone number" });
//   }

//   if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
//     return res.status(400).json({ message: "Names must be letters" });
//   }

//   if (!validator.isNumeric(streetNumber) || !validator.isNumeric(postcode)) {
//     return res
//       .status(400)
//       .json({ message: "Street number and post code must be numbers" });
//   }

//   const address = `${
//     unitNumber ? `Unit ${unitNumber}, ` : ""
//   }${streetNumber} ${streetName} ${streetType}, ${suburb}, ${postcode}`;

//   const newUser = Users.newUser(
//     null,
//     validator.escape(email),
//     bcrypt.hashSync(password, 10),
//     "admin",
//     validator.escape(phoneNumber),
//     validator.escape(firstName),
//     validator.escape(lastName),
//     validator.escape(address)
//   );
//   // check if the email already exists
//   try {
//     const existingEmailUser = await Users.getByEmailAddress(email)
//     if (existingEmailUser ) {
//       return res.status(400).json({
//         status: 400,
//         message: "Email already exists."
//       }) 
//     } 
//   } catch (error) {

//     if (error === "Email does not exist.") {
//       try {
//         const existingPhoneUser = await Users.getByPhone(phone)
//         if (existingPhoneUser) {
//           return res.status(400).json({
//             status: 400,
//             message: "Phone Number already exists."
//           })
//         }

//       } catch (error) {
//         if (error === "Phone does not exist.") {
//           const [result] = await Users.create(newUser)
//           res.json.status(201)({
//             status: 201,
//             message: "Signup Successful",
//             userId: result.insertId,

//           })
//         }
//       }
//       try {
//         const [result] = await Users.create(newUser);
//         res.json.status(201)({
//           status: 201,
//           message: "Signup successful",
//           userId: result.insertId,
//         });
//       } catch (error) {
//         res.status(500).json({ message: "Error creating user", error });
//       }
//     } else {
//       return res.status(500).json({
//         status: 500,
//         message: "Error checking existing email", 
//         error
//       })
//     }
//   }



// });

userController.post("/register", async (req, res) => {
  const formData = req.body;
  const {
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      unitNumber,
      streetNumber,
      streetName,
      streetType,
      suburb,
      postcode,
  } = formData;

  console.log("formData is: ", formData);

  // Validate inputs
  if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
  }

  if (!validator.isLength(password, { min: 6 }) || !validator.isAlphanumeric(password)) {
      return res.status(400).json({ message: "Invalid password" });
  }

  if (!/^04\d{8}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
  }

  if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
      return res.status(400).json({ message: "Names must be letters" });
  }

  if (!validator.isNumeric(streetNumber) || !validator.isNumeric(postcode)) {
      return res.status(400).json({ message: "Street number and post code must be numbers" });
  }

  const address = `${unitNumber ? `Unit ${unitNumber}, ` : ""}${streetNumber} ${streetName} ${streetType}, ${suburb}, ${postcode}`;

  const newUser = Users.newUser(
      null,
      validator.escape(email),
      bcrypt.hashSync(password, 10),
      "member",
      validator.escape(phoneNumber),
      validator.escape(firstName),
      validator.escape(lastName),
      validator.escape(address)
  );

  try {
      // Check if the email already exists
      try {
          await Users.getByEmailAddress(email);
          // If the code reaches here, it means the email already exists
          return res.status(400).json({
              status: 400,
              message: "Email already exists!"
          });
      } catch (emailError) {
          // Email does not exist, continue to check phone number
          if (emailError !== "Email does not exist.") {
              // If the error is not about email not existing, handle it
              throw emailError;
          }
      }

      // Check if the phone number already exists
      try {
          await Users.getByPhone(phoneNumber);
          // If the code reaches here, it means the phone number already exists
          return res.status(400).json({
              status: 400,
              message: "Phone number already exists!!!"
          });
      } catch (phoneError) {
          // Phone number does not exist, proceed to create the user
          if (phoneError !== "Phone does not exist.") {
              // If the error is not about phone not existing, handle it
              throw phoneError;
          }
      }

      // Create the new user if both email and phone number are unique
      const [result] = await Users.create(newUser);
      res.status(201).json({
          status: 201,
          message: "Signup successful",
          userId: result.insertId,
      });

  } catch (error) {
      console.error("Error during registration: ", error);
      return res.status(500).json({
          status: 500,
          message: "Error during registration",
          error
      });
  }
});




// Update user route
userController.patch("/users/:id", auth(["admin", "member", "trainer"]), async (req, res) => {
  const userId = req.params.id; // Get user ID from URL params
  const formData = req.body;
  const {
    email,
    password,
    phone,
    firstname,
    lastname,
    unitNumber,
    streetNumber,
    streetName,
    streetType,
    suburb,
    postcode,
  } = formData;

  console.log("formData is: ", formData);

  // Validate inputs
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (password && (!validator.isLength(password, { min: 6 }))) {
    return res.status(400).json({ message: "Invalid password" });
  }

  if (phone && !/^04\d{8}$/.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  if (firstname && !validator.isAlpha(firstname) || lastname && !validator.isAlpha(lastname)) {
    return res.status(400).json({ message: "Names must be letters" });
  }

  if (streetNumber && !validator.isNumeric(streetNumber) || postcode && !validator.isNumeric(postcode)) {
    return res.status(400).json({ message: "Street number and post code must be numbers" });
  }

  const address = `${
    unitNumber ? `Unit ${unitNumber}, ` : ""
  }${streetNumber} ${streetName} ${streetType}, ${suburb}, ${postcode}`;

  const user = await Users.getById(userId)
  console.log("the user to be updated is: ", user )
  const userRole = user.role
  const updatedUser = Users.newUser(
   userId,
   validator.escape(email), 
   bcrypt.hashSync(password, 10),
    userRole,
    validator.escape(phone),
    validator.escape(firstname),
    validator.escape(lastname),
    validator.escape(address)
  );

  console.log("updated user is: ", updatedUser)



  try {
    // Filter out undefined properties (those that were not provided for update)
    const filteredUpdates = Object.fromEntries(
      Object.entries(updatedUser).filter(([_, value]) => value !== undefined)
    );

    // Call the Users service to update the user
    const [result] = await Users.update(filteredUpdates);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      status: 200,
      message: "Update successful",
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});


// Route to manage users (only for admins)
userController.get("/manage-users", auth(["admin"]), async (req, res) => {
  const { accessRole, firstName } = req.user;
  const editID = req.query.edit_id;

  try {
    if (editID) {
      const editUser = await Users.getById(editID);
      const allUsers = await Users.getAll();
      res.json({ allUsers, editUser, accessRole, firstName });
    } else {
      const allUsers = await Users.getAll();
      res.json({
        allUsers,
        editUser: Users.newUser(0, "", "", "", "", "", "", ""),
        accessRole,
        firstName,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Route to handle user creation, updating, and deletion
userController.post("/manage-users", auth(["admin"]), async (req, res) => {
  const formData = req.body;

  // Validate inputs
  if (
    !formData.email ||
    !formData.password ||
    !formData.access_role ||
    !formData.phone ||
    !formData.first_name ||
    !formData.last_name ||
    !formData.address
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(formData.email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (
    !validator.isAlpha(formData.first_name) ||
    !validator.isAlpha(formData.last_name)
  ) {
    return res
      .status(400)
      .json({ message: "First and last names must be letters" });
  }

  if (
    !validator.isLength(formData.password, { min: 6 }) ||
    !validator.isAlphanumeric(formData.password)
  ) {
    return res.status(400).json({ message: "Invalid password" });
  }

  if (!/^04\d{8}$/.test(formData.phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  const editedUser = Users.newUser(
    formData.user_id,
    formData.email,
    formData.password,
    formData.access_role,
    formData.phone,
    formData.first_name,
    formData.last_name,
    formData.address
  );

  if (!bcrypt.compareSync(formData.password, editedUser.password)) {
    editedUser.password = bcrypt.hashSync(formData.password, 10);
  }

  try {
    if (formData.action === "create") {
      await Users.create(editedUser);
    } else if (formData.action === "update") {
      await Users.update(editedUser);
    } else if (formData.action === "delete") {
      await Users.deleteById(editedUser.id);
    }
    res.json({ message: "User management action completed" });
  } catch (error) {
    res.status(500).json({ message: "Error managing user", error });
  }
});

userController.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.getById(userId); 
    console.log("The specific user  is ${user}", user )
   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to get the user's profile
userController.get(
  "/my-profile",
  auth(["admin", "trainer", "member"]),
  async (req, res) => {
    const userID = req.user.userID;

    try {
      const user = await Users.getById(userID);
      res.json({
        accessRole: req.user.role,
        firstName: req.user.firstName,
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile", error });
    }
  }
);

// Route to update the user's profile
userController.post(
  "/my-profile",
  auth(["admin", "trainer", "member"]),
  async (req, res) => {
    const userID = req.user.userID;
    const formData = req.body;

    // Validate inputs
    if (!validator.isEmail(formData.email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (
      !validator.isAlpha(formData.first_name) ||
      !validator.isAlpha(formData.last_name)
    ) {
      return res
        .status(400)
        .json({ message: "First and last names must be letters" });
    }

    if (
      !validator.isLength(formData.password, { min: 6 }) ||
      !validator.isAlphanumeric(formData.password)
    ) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!/^04\d{8}$/.test(formData.phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const newUser = Users.newUser(
      userID,
      validator.escape(formData.email),
      formData.password,
      "member",
      validator.escape(formData.phone),
      validator.escape(formData.first_name),
      validator.escape(formData.last_name),
      validator.escape(formData.address)
    );

    // Hash the password if it's changed
    if (!bcrypt.compareSync(formData.password, newUser.password)) {
      newUser.password = bcrypt.hashSync(formData.password, 10);
    }

    try {
      await Users.update(newUser);
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  }
);



export default userController;
