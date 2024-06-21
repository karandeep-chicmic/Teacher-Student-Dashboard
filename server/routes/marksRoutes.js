const Joi = require("joi");
const {
  uploadMarks,
  getMarksOfStudent,
  updateMarks,
  deleteMarksOfStudent,
} = require("../controllers/marksController");

const marksRoute = [
  {
    method: "POST",
    path: "/marks",
    schema: {
      body: {
        studentId: Joi.string().required(),
        marks: Joi.number().required().min(0).max(100),
        subject: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: uploadMarks,
  },
  {
    method: "GET",
    path: "/marks/:studentId",
    schema: {
      params: {
        studentId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: getMarksOfStudent,
  },
  {
    method: "PUT",
    path: "/updateMarks/:id",
    schema: {
      body: {
        marks: Joi.number().required().min(0).max(100),
      },
      params: {
        id: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: updateMarks,
  },
  {
    method: "DELETE",
    path: "/deleteMarks/:id",
    schema: {
      params: {
        id: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: deleteMarksOfStudent ,
  },
];

module.exports = marksRoute;
