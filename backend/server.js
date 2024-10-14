const express = require("express");
const cors = require("cors");
const {
  createUser,
  validateUser,
  generateToken,
  sanitizeUser,
  getAllCategories,
  getAllBusinesses,
  updateUser,
  deleteUser,
  findUserById,
  createAppointment,
  getAppointmentsByUserId,
  updateAppointment,
  deleteAppointment,
} = require("./database");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// const obj = {
//   name: "aleksis",
//   age: 29,
// };

// req.send(obj);

app.use(cors(corsOptions));
app.use(express.json());

const decodeToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = { id: decoded.userId, email: decoded.email };
      next();
    });
  } else {
    res.status(401).json({ error: "Authentication token is required" });
  }
};

// added code last night

app.get("/appointments", decodeToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.appointments || []);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
});

// Get a specific appointment by ID
app.get("/appointments/:id", decodeToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const appointment = user.appointments.find(
      (app) => app._id.toString() === appointmentId
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Error fetching appointment" });
  }
});

// @deprecated: Use /user endpoint to fetch user data including appointments
app.post("/appointments", decodeToken, async (req, res) => {
  const { date, time, category } = req.body;
  const userId = req.user.id;

  if (!date || !time || !category) {
    return res
      .status(400)
      .json({ error: "Date, time, and category are required" });
  }

  try {
    const appointment = await createAppointment(userId, date, time, category);
    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Error creating appointment" });
  }
});

// response = res = ka siunciam i frontenda
// request  = req = ka gaunam is frontendo

app.put("/appointments/:id", decodeToken, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedAppointment = await updateAppointment(
      req.user.id,
      id,
      updateData
    );
    res.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    if (
      error.message === "User not found" ||
      error.message === "Appointment not found"
    ) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error updating appointment" });
    }
  }
});

app.delete("/appointments/:id", decodeToken, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAppointment(req.user.id, id);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    if (
      error.message === "User not found" ||
      error.message === "Appointment not found"
    ) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error deleting appointment" });
    }
  }
});

// ended here

app.post("/register", async (req, res) => {
  console.log("Received registration request:", req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    console.log("Missing fields:", { name, email, password });
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    const user = await createUser(name, email, password);
    const token = await generateToken(user);
    res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Error registering user" });
    }
  }
});

// Add this new login route
app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await validateUser(email, password);
    if (user) {
      const token = await generateToken(user);
      const sanitizedUser = sanitizeUser(user);
      res.json({
        message: "Login successful",
        user: sanitizedUser,
        token,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
});

app.get("/businesses", async (req, res) => {
  try {
    const businesses = await getAllBusinesses();
    res.json(businesses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
});

app.get("/user", decodeToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Ensure we're sending the full user object, including appointments
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        appointments: user.appointments || [],
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

// Modify your existing update route
app.put("/user/update", decodeToken, async (req, res) => {
  const { id } = req.user;
  const updateData = req.body;

  try {
    const updatedUser = await updateUser(id, updateData);
    if (updatedUser) {
      res.json({
        message: "User updated successfully",
        user: sanitizeUser(updatedUser),
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

// Add this new route to delete a user
app.delete("/user/delete", decodeToken, async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the account" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
