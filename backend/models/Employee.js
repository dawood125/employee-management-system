import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      default: "",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Please assign a department"],
    },
    position: {
      type: String,
      required: [true, "Please add a position"],
      trim: true,
    },
    salary: {
      type: Number,
      default: 0,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Auto generate employee ID before saving
employeeSchema.pre("save", async function () {
  if (!this.employeeId) {
    const count = await mongoose.model("Employee").countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, "0")}`;
  }
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
