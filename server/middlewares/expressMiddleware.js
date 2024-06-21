const cors = require("cors");
const routes = require("../routes");
const express = require("express");
const path = require("path");
const multer = require("multer");
const { authorizeUser } = require("../middlewares/authMiddleware");
const { validate } = require("./validateMiddleware");

const storage = multer.diskStorage({
  destination: "./public",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploads = multer({ storage: storage });

const handlers = (route) => {
  return (req, res) => {
    let payload = {
      ...(req.body || {}),
      ...(req.query || {}),
      ...(req.params || {}),
      userId: req.userId,
      file: req.file,
      roleOfUser: req.roleOfUser,
    };
    route
      .controller(payload)
      .then((result) => {
        res.status(result.statusCode).json(result.data);
      })
      .catch((err) => {
        if (err?.statusCode) {
          res.status(err?.statusCode).json(err.message);
        }
        res.status(500).json(err.message);
      });
  };
};

const expressMiddleware = async (app) => {
  app.use(cors());
  app.use(express.json());
  app.use("/public", express.static("public"));

  routes.forEach((route) => {
    let middlewares = [];

    if (route.file) {
      middlewares.push(uploads.single("file"));
    }
    if (route.auth) {
      middlewares.push(authorizeUser());
    }
    if (route.schema) {
      middlewares.push(validate(route.schema));
    }

    app
      .route(route.path)
      [route.method.toLowerCase()](...middlewares, handlers(route));
  });
};

module.exports = expressMiddleware;
