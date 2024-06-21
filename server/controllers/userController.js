const fs = require("fs");
const { RESPONSE_MSGS, ROLES } = require("../constants");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const { userModel } = require("../models/usersModel");

dotenv.config();

const saltRounds = 10;

async function registerUser(payload) {
  const { name, email, password, file } = payload;
  const salt = bcrypt.genSaltSync(saltRounds);

  const objToSaveToDb = {
    name: name,
    password: bcrypt.hashSync(password, salt),
    email: email,
    role: ROLES.STUDENT,
    profilePicture: file.path,
  };
  console.log(objToSaveToDb);
  const registerUserM = await userModel.create(objToSaveToDb);

  const token = jwt.sign(
    { id: registerUserM._id, email: email, role: registerUserM.role },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "2500s",
    }
  );

  const response = {
    message: RESPONSE_MSGS.SUCCESS,
    userDetails: registerUserM,
    token: token,
    userId: registerUserM._id,
    role: registerUserM.role,
  };

  return {
    statusCode: 201,
    data: response,
  };
}

async function loginUser(payload) {
  const { email, password } = payload;

  var passwordMatch;
  var userFound = await userModel.findOne({ email: email });

  if (userFound) {
    passwordMatch = bcrypt.compareSync(password, userFound.password);
  } else {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.USER_NOT_EXIST,
    };
  }
  if (passwordMatch) {
    const token = jwt.sign(
      { id: userFound.id, email: email, role: userFound.role },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2500s",
      }
    );

    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        token: token,
        email: email,
        userId: userFound._id,
        role: userFound.role,
      },
    };
  } else {
    return {
      statusCode: 401,
      data: RESPONSE_MSGS.WRONG_PASSWORD,
    };
  }
}

const roleChange = async (payload) => {
  const { id, role, roleOfUser } = payload;

  if (roleOfUser !== ROLES.ADMIN) {
    return {
      statusCode: 403,
      data: RESPONSE_MSGS.UNAUTHORIZED,
    };
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    { role: role },
    { new: true }
  );
  if (!updatedUser) {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.FAILURE,
    };
  }
  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      user: updatedUser,
    },
  };
};

const getUsers = async (payload) => {
  const { roleOfUser } = payload;

  if (roleOfUser !== ROLES.TEACHER) {
    return {
      statusCode: 403,
      data: RESPONSE_MSGS.UNAUTHORIZED,
    };
  } else {
    const users = await userModel.aggregate([
      {
        $match: { role: ROLES.STUDENT },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          profilePicture: 1,
        },
      },
      {
        $lookup: {
          from: "marks",
          localField: "_id",
          foreignField: "studentId",
          as: "marks",
        },
      },
    ]);

    if (!users) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.FAILURE,
      };
    }

    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        data: users,
      },
    };
  }
};

const getAllUsers = async (payload) => {
  const { roleOfUser } = payload;
  if (roleOfUser !== ROLES.ADMIN) {
    return {
      statusCode: 403,
      data: RESPONSE_MSGS.UNAUTHORIZED,
    };
  }

  const users = await userModel.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        profilePicture: 1,
      },
    },
  ]);

  if (!users) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.FAILURE,
    };
  }

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: users,
    },
  };
};

module.exports = {
  loginUser,
  registerUser,
  roleChange,
  getUsers,
  getAllUsers,
};
