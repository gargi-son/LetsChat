const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

//Writing the Protect middleware for Authorization and wrapped inside async to handle errors
//since its a middleware, it takes request response and next to move on to the next operation

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization && // In our request we are going to send the token inside the headers of the request
    req.headers.authorization.startsWith("Bearer")
  ) {
    // it will go in the try block when we have the token
    try {
      //token format: Bearer dghhdg.uhsfjhs.hfshfoi
      // split will split the token at the space and remove the Bearer.

      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // decoding the token

      req.user = await User.findById(decoded.id).select("-password"); // find it by the decoded id and return the decoded user without the password

      next(); // move on to the next operation
    } catch (error) {
      //otherwise catch the error, token failed
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Token not found, not authorized");
  }
});

module.exports = { protect };
