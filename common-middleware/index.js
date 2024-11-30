const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../uploads");

// Ensure the 'uploads' directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination Hit"); // Log when the destination is reached
    cb(null, uploadPath); // Files will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    console.log("Filename Hit"); // Log when the filename is set
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});



// Middleware to check if user is signed in with a valid JWT token
const requireSignin = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res
        .status(400)
        .json({ message: "Authorization required; use a valid token" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Authorization required, use a valid token" });
  }
};


// Export all functions and middleware as an object
module.exports = {
  requireSignin,
  upload,
};
