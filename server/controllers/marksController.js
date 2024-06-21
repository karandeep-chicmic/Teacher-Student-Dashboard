const { RESPONSE_MSGS, ROLES } = require("../constants");
const { marksModel } = require("../models/marksModel");

const uploadMarks = async (payload) => {
  const { marks, subject, studentId, roleOfUser } = payload;

  if (roleOfUser !== ROLES.TEACHER) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.ONLY_TEACHERS,
      },
    };
  }

  const data = await marksModel.create({
    studentId: studentId,
    subject: subject,
    marks: marks,
  });

  if (!data) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.FAILURE,
      },
    };
  }

  return {
    statusCode: 201,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: data,
    },
  };
};

const updateMarks = async (payload) => {
  const { id, marks, roleOfUser } = payload;

  console.log("inside updateMarks!!");

  if (roleOfUser !== ROLES.TEACHER) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.ONLY_TEACHERS,
      },
    };
  }

  const marksUpdate = await marksModel.findByIdAndUpdate(
    id,
    {
      $set: {
        marks: marks,
      },
    },
    {
      new: true,
    }
  );

  if (!marksUpdate) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.FAILURE,
      },
    };
  }

  return {
    statusCode: 201,
    data: {
      message: RESPONSE_MSGS.MARKS_UPDATED,
      data: marksUpdate,
    },
  };
};

const getMarksOfStudent = async (payload) => {
  const { studentId, roleOfUser, userId } = payload;

  if (roleOfUser === ROLES.STUDENT && studentId !== userId) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.STUDENT_ACCESS,
      },
    };
  }

  if (roleOfUser != ROLES.STUDENT && roleOfUser != ROLES.TEACHER) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.NOT_A_STUDENT_OR_TEACHER,
      },
    };
  }
  const data = await marksModel.find({ studentId: studentId });

  if (data.length === 0) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.NO_MARKS,
    };
  }

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: data,
    },
  };
};

const deleteMarksOfStudent = async (payload) => {
  const { id, roleOfUser } = payload;
  if (roleOfUser != ROLES.TEACHER) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.ONLY_TEACHERS,
      },
    };
  }

  const deleteMarks = await marksModel.findOneAndDelete(id);

  if (!deleteMarks) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.FAILURE,
    };
  }

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      dataDeleted: deleteMarks,
    },
  };
};

module.exports = {
  uploadMarks,
  getMarksOfStudent,
  updateMarks,
  deleteMarksOfStudent,
};
