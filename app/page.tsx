"use client";

import CompanyTable from "@/components/CompanyManager/CompanyTable";
import { Plus, Database } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className=" bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white shadow-sm border">
              <Database className="w-10 h-10 text-blue-600" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Company Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Quick overview & management</p>
            </div>
          </div>
        </motion.div>

        {/* ADD BUTTON */}
        <div className="mb-8 flex justify-end">
          <Link
            href="/insert"
            className="inline-flex border-2 items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition"
          >
            <Plus className="w-5 h-5" />
            Add Company
          </Link>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <CompanyTable />
        </div>
      </div>
    </main>
  );
}
