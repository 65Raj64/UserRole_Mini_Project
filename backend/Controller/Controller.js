const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");
const UserRole = require("../Models/userRole");
const Role = require("../Models/role");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      });
    }
    const userModel = new UserModel({ name, email, password });
    console.log(userModel, "userModel");
    userModel.password = await bcrypt.hash(password, 10);
    console.log(userModel.password, "userModel2222");
    const data = await userModel.save();
    console.log(userModel, "userModel2222");
    console.log(data, "data");
    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is wrong";

    console.log(user, "user");
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

const addUserrole = async (req, res) => {
  try {
    const { name, mobile, email, role } = req.body;

    const images = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });

    const newUserRole = new UserRole({
      name,
      mobile,
      email,
      images,
      role,
    });

    const savedUserRole = await newUserRole.save();

    res.status(201).json({
      success: true,
      message: "UserRole created successfully",
      data: savedUserRole,
    });
  } catch (error) {
    console.error("Error creating UserRole:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create UserRole",
      error: error.message,
    });
  }
};

const addrole = async (req, res) => {
  try {
    const { name } = req.body;

    const newRole = new Role({
      name,
    });

    const savedRole = await newRole.save();

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: savedRole,
    });
  } catch (err) {
    console.error("Error creating Role:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create Role",
      error: err.message,
    });
  }
};
const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedData = { name };
    const role = await Role.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (err) {
    console.error("Error updating Role:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update Role",
      error: err.message,
    });
  }
};

const getuserroleListAll = async (req, res) => {
  try {
    const result = await UserRole.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleDetails",
        },
      },
      {
        $unwind: {
          path: "$roleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          mobile: 1,
          email: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          role: "$roleDetails.name",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "UserRole List",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user roles",
      error: err.message,
    });
  }
};

const getroleListAll = async (req, res) => {
  try {
    const result = await Role.find();

    res.status(201).json({
      success: true,
      message: "Role List",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed ",
      error: err.message,
    });
  }
};
const getlistRole = async (req, res) => {
  try {
    const roleList = await Role.aggregate([
      {
        $project: {
          id: "$_id",
          label: "$name",
          _id: 0,
        },
      },
    ]);
    res.status(201).json({
      success: true,
      message: "Role List",
      data: roleList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed ",
      error: err.message,
    });
  }
};
const getroleDetails = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "role not found" });
    }
    res.status(201).json({
      success: true,
      message: "Role List",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, mobile, email, role } = req.body;
    let updateData = { name, mobile, email, role };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await UserRole.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "UserRole not found" });
    }

    res.status(200).json({
      success: true,
      message: "UserRole updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};
const getuserDetails = async (req, res) => {
  try {
    const role = await UserRole.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "role not found" });
    }
    res.status(201).json({
      success: true,
      message: "UserRole Details",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};

const roleDelete = async (req, res) => {
  try {
    const roledelete = await Role.findByIdAndDelete(req.params.id);
    if (!roledelete) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(201).json({
      success: true,
      message: "Role Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};

const userRoleDelete = async (req, res) => {
  try {
    const roledelete = await UserRole.findByIdAndDelete(req.params.id);
    if (!roledelete) {
      return res.status(404).json({ message: "UserRole not found" });
    }

    res.status(201).json({
      success: true,
      message: "UserRole Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  addUserrole,
  addrole,
  updateRole,
  getuserroleListAll,
  getroleListAll,
  getlistRole,
  getroleDetails,
  updateUser,
  getuserDetails,
  roleDelete,
  userRoleDelete,
};
