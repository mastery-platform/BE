const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a skill name"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    estimatedHours: {
      type: Number,
      required: [true, "Please add estimated hours"],
      min: [1, "Estimated hours must be at least 1"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
