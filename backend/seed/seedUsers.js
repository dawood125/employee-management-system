import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Task from "../models/Task.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Employee.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create Users (with different roles)
    const users = await User.create([
      {
        name: "Dawood Ahmed",
        email: "admin@ems.com",
        password: "Admin@123",
        role: "admin"
      },
      {
        name: "Sarah Khan",
        email: "manager@ems.com",
        password: "Manager@123",
        role: "manager"
      },
      {
        name: "Ali Hassan",
        email: "employee@ems.com",
        password: "Employee@123",
        role: "employee"
      },
      {
        name: "Fatima Sheikh",
        email: "fatima@ems.com",
        password: "Fatima@123",
        role: "manager"
      }
    ]);
    console.log(`👥 Created ${users.length} users`);

    // Create Departments
    const departments = await Department.create([
      {
        name: "Engineering",
        description: "Software development and technical operations",
        manager: users[1]._id // Sarah Khan
      },
      {
        name: "Human Resources",
        description: "People operations and talent management",
        manager: users[3]._id // Fatima Sheikh
      },
      {
        name: "Marketing",
        description: "Brand, content, and growth marketing",
        manager: users[1]._id
      },
      {
        name: "Sales",
        description: "Revenue and customer acquisition",
        manager: users[3]._id
      }
    ]);
    console.log(`🏢 Created ${departments.length} departments`);

    // Create Employees
    const employees = await Employee.create([
      {
        name: "Ahmed Raza",
        email: "ahmed.raza@ems.com",
        phone: "+92-300-1234567",
        position: "Senior Software Engineer",
        department: departments[0]._id,
        salary: 180000,
        status: "active",
        joinDate: new Date("2023-01-15")
      },
      {
        name: "Ayesha Malik",
        email: "ayesha.malik@ems.com",
        phone: "+92-301-2345678",
        position: "Frontend Developer",
        department: departments[0]._id,
        salary: 120000,
        status: "active",
        joinDate: new Date("2023-06-20")
      },
      {
        name: "Hassan Ali",
        email: "hassan.ali@ems.com",
        phone: "+92-302-3456789",
        position: "Backend Developer",
        department: departments[0]._id,
        salary: 140000,
        status: "active",
        joinDate: new Date("2024-02-10")
      },
      {
        name: "Zainab Bibi",
        email: "zainab.bibi@ems.com",
        phone: "+92-303-4567890",
        position: "HR Manager",
        department: departments[1]._id,
        salary: 150000,
        status: "active",
        joinDate: new Date("2022-11-05")
      },
      {
        name: "Bilal Akhtar",
        email: "bilal.akhtar@ems.com",
        phone: "+92-304-5678901",
        position: "Marketing Lead",
        department: departments[2]._id,
        salary: 130000,
        status: "active",
        joinDate: new Date("2023-09-12")
      },
      {
        name: "Sana Tariq",
        email: "sana.tariq@ems.com",
        phone: "+92-305-6789012",
        position: "Sales Executive",
        department: departments[3]._id,
        salary: 100000,
        status: "active",
        joinDate: new Date("2024-04-18")
      },
      {
        name: "Usman Shahid",
        email: "usman.shahid@ems.com",
        phone: "+92-306-7890123",
        position: "UI/UX Designer",
        department: departments[0]._id,
        salary: 110000,
        status: "on_leave",
        joinDate: new Date("2023-08-22")
      },
      {
        name: "Maryam Nawaz",
        email: "maryam.nawaz@ems.com",
        phone: "+92-307-8901234",
        position: "Content Writer",
        department: departments[2]._id,
        salary: 80000,
        status: "active",
        joinDate: new Date("2024-01-30")
      }
    ]);
    console.log(`👨‍💼 Created ${employees.length} employees`);

    // Create Tasks
    const tasks = await Task.create([
      {
        title: "Design new dashboard layout",
        description: "Create wireframes and high-fidelity designs for the new analytics dashboard",
        assignee: employees[0]._id,
        department: departments[0]._id,
        priority: "high",
        status: "in_progress",
        dueDate: new Date("2026-07-15")
      },
      {
        title: "Implement user authentication",
        description: "Add JWT-based auth with refresh tokens and password reset flow",
        assignee: employees[2]._id,
        department: departments[0]._id,
        priority: "high",
        status: "completed",
        dueDate: new Date("2026-06-30")
      },
      {
        title: "Q3 marketing campaign planning",
        description: "Plan and schedule social media posts, email campaigns, and blog content for Q3",
        assignee: employees[4]._id,
        department: departments[2]._id,
        priority: "medium",
        status: "pending",
        dueDate: new Date("2026-07-25")
      },
      {
        title: "Employee onboarding process review",
        description: "Review and optimize the 30-60-90 day onboarding checklist",
        assignee: employees[3]._id,
        department: departments[1]._id,
        priority: "medium",
        status: "in_progress",
        dueDate: new Date("2026-07-20")
      },
      {
        title: "Sales pipeline cleanup",
        description: "Archive stale leads and update CRM with Q2 opportunities",
        assignee: employees[5]._id,
        department: departments[3]._id,
        priority: "low",
        status: "pending",
        dueDate: new Date("2026-08-01")
      },
      {
        title: "API rate limiting implementation",
        description: "Add Redis-based rate limiting to public API endpoints",
        assignee: employees[2]._id,
        department: departments[0]._id,
        priority: "high",
        status: "pending",
        dueDate: new Date("2026-07-18")
      },
      {
        title: "Mobile responsive design fixes",
        description: "Fix layout issues on mobile viewports for employees and tasks pages",
        assignee: employees[1]._id,
        department: departments[0]._id,
        priority: "medium",
        status: "in_progress",
        dueDate: new Date("2026-07-22")
      },
      {
        title: "Customer feedback analysis report",
        description: "Compile Q2 customer feedback into actionable insights report",
        assignee: employees[7]._id,
        department: departments[2]._id,
        priority: "low",
        status: "completed",
        dueDate: new Date("2026-06-28")
      }
    ]);
    console.log(`✅ Created ${tasks.length} tasks`);

    console.log("\n🎉 SEED COMPLETE!");
    console.log("\n📋 Test Accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:    admin@ems.com     / Admin@123");
    console.log("Manager:  manager@ems.com   / Manager@123");
    console.log("Manager:  fatima@ems.com    / Fatima@123");
    console.log("Employee: employee@ems.com  / Employee@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
