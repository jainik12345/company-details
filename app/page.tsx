"use client";

import CompanyTable from "@/components/CompanyManager/CompanyTable";
import { Plus, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8">
            <Database className="w-12 h-12 text-blue-600" />
            <div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-slate-900 bg-clip-text text-transparent">
                Company Dashboard
              </h1>
              <p className="text-xl text-slate-600 mt-2 font-medium">
                Manage all your companies efficiently
              </p>
            </div>
          </div>
          <motion.a
            href="/insert"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-10 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-green-700 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Add New Company
          </motion.a>
        </motion.div>

        <CompanyTable />
      </div>
    </main>
  );
}
