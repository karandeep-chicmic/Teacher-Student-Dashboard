const jwt = require("jsonwebtoken");

const authorizeUser = () => {
  return (req, res, next) => {
    console.log("inside Authorize");

    const { token } = req.headers;

    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
          throw err;
        } else {
          req.userId = data.id;
          req.roleOfUser = data.role;
          
          console.log("Token Verified through middleware");
          next();
        }
      });
    } else {
      throw new Error("Token is not even generated !!");
    }
  };
};

module.exports = { authorizeUser };
