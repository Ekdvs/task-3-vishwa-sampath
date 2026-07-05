import { motion } from "framer-motion";

export default function ChartCard({ title, children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-5 rounded-xl shadow"
    >
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </motion.div>
  );
}