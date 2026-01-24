import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Employee Management System
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {user?.name}
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700">Employees</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">--</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700">Tasks</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">--</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700">Departments</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">--</p>
          </div>
        </div>

        <p className="mt-8 text-gray-600">
          Dashboard stats will be added in the next session!
        </p>
      </main>
    </div>
  );
};

export default Dashboard;