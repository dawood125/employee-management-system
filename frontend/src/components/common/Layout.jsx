import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100">
      <Sidebar />
      
      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default Layout;