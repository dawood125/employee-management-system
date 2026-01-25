import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const colorClasses = {
    indigo: "from-indigo-600 to-indigo-400 shadow-indigo-500/30",
    emerald: "from-emerald-600 to-emerald-400 shadow-emerald-500/30",
    amber: "from-amber-600 to-amber-400 shadow-amber-500/30",
    rose: "from-rose-600 to-rose-400 shadow-rose-500/30",
    cyan: "from-cyan-600 to-cyan-400 shadow-cyan-500/30",
    purple: "from-purple-600 to-purple-400 shadow-purple-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="stat-card group"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.p>
        </div>
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Decorative line */}
      <div
        className={`h-1 w-20 mt-4 rounded-full bg-gradient-to-r ${colorClasses[color]} opacity-50`}
      />
    </motion.div>
  );
};

export default StatsCard;
