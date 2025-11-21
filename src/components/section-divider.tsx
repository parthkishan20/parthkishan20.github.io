import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-16"
    />
  );
}
