const {
  signup,
  login,
  addUserrole,
  addrole,
  getuserroleListAll,
  getroleListAll,
  getlistRole,
  getroleDetails,
  updateRole,
  updateUser,
  getuserDetails,
  roleDelete,
  userRoleDelete,
} = require("../Controller/Controller");
const {
  signupValidation,
  loginValidation,
} = require("../Middleware/Middleware");
const ensureAuthenticated = require("../Controller/Auth");
const multer = require("multer");
const path = require("path");
const router = require("express").Router();
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post(
  "/add-userrole",
  upload.array("images", 5),
  ensureAuthenticated,
  addUserrole
);
router.post("/add-role", ensureAuthenticated, addrole);
router.get("/list-userrole", ensureAuthenticated, getuserroleListAll);
router.get("/list-role", ensureAuthenticated, getroleListAll);
router.get("/role-list", ensureAuthenticated, getlistRole);
router.get("/role-details/:id", ensureAuthenticated, getroleDetails);
router.put("/role-update/:id", ensureAuthenticated, updateRole);
router.put("/user-update/:id", ensureAuthenticated, updateUser);
router.get("/user-details/:id", ensureAuthenticated, getuserDetails);
router.delete("/role-delete/:id", ensureAuthenticated, roleDelete);
router.delete("/user-delete/:id", ensureAuthenticated, userRoleDelete);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});
module.exports = router;
