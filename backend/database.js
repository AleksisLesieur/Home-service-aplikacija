const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Home-service-application",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const AppointmentSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    appointments: [AppointmentSchema], // Add this line
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

const CategoriesSchema = new mongoose.Schema({}, { strict: false });

const BusinessSchema = new mongoose.Schema({}, { strict: false });

// If you know the name of your collection, specify it here
const Categories = mongoose.model("Categories", CategoriesSchema, "Categories");

const Businesses = mongoose.model("Businesses", BusinessSchema, "Businesses");

// added code last night

async function createAppointment(userId, date, time, category) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const newAppointment = { date, time, category };
    user.appointments.push(newAppointment);
    await user.save();
    return newAppointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}
async function getAppointmentsByUserId(userId) {
  try {
    const user = await User.findById(userId);
    return user ? user.appointments : [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

async function updateAppointment(userId, appointmentId, updateData) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const appointment = user.appointments.id(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    Object.assign(appointment, updateData);
    await user.save();
    return appointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
}

async function deleteAppointment(userId, appointmentId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.appointments.id(appointmentId).remove();
    await user.save();
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
}

// ends here

// Function to get all Categories
async function getAllCategories() {
  try {
    const categories = await Categories.find();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function getAllBusinesses() {
  try {
    const businesses = await Businesses.find();
    return businesses;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function createUser(name, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
}

async function validateUser(email, password) {
  try {
    const user = await findUserByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  } catch (error) {
    console.error("Error validating user:", error);
    throw error;
  }
}

async function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
}
function sanitizeUser(user) {
  const { _id, name, email, createdAt, updatedAt } = user;
  return { id: _id, username: name, email, createdAt, updatedAt };
}

async function findUserById(id) {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

async function updateUser(id, updateData) {
  try {
    const user = await User.findById(id);
    if (!user) return null;

    if (updateData.username) user.name = updateData.username;
    if (updateData.email) user.email = updateData.email;
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }

    await user.save();
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function deleteUser(id) {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  findUserByEmail,
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
};
