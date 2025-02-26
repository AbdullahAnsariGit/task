const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    // firstName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      unique: true,
      match:
        /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    rollNo: {
      type: String,
      require: true,
    },
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    taskDescription: {
      type: String,
      trim: true,
    },
    repoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    hostedUrl: {
      type: String,
      required: true,
      trim: true, // Removes whitespace
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Task", TaskSchema);
