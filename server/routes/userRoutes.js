const Joi = require("joi");
const {
  loginUser,
  registerUser,
  roleChange,
  getUsers,
  getAllUsers
} = require("../controllers/userController");

const userRoutes = [
  {
    method: "POST",
    path: "/user/register",
    schema: {
      body: {
        file: Joi.string().optional(),
        name: Joi.string().required(),

        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      },
    },
    auth: false,
    file: true,
    controller: registerUser,
  },
  {
    method: "POST",
    path: "/user/login",
    schema: {
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      },
    },
    auth: false,
    file: false,
    controller: loginUser,
  },
  {
    method: "PUT",
    path: "/roleChange/:id",
    schema: {
      params: {
        id: Joi.string().required(),
      },
      body: {
        role: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: roleChange,
  },
  {
    method: "GET",
    path: "/getStudents",
    auth: true,
    file: false,
    controller: getUsers,
  },{
    method: "GET",
    path: "/getAllUsers",
    auth: true,
    file: false,
    controller: getAllUsers,
  }
];

module.exports = userRoutes;
