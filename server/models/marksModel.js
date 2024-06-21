const { Schema, model } = require("mongoose");

const marksSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const marksModel = model("marks", marksSchema, "marks");

module.exports = { marksModel };
