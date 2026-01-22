import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add department name"],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;