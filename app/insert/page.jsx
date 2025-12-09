"use client";

import CompanyForm from "@/components/CompanyManager/CompanyForm";
import { ArrowLeft, PlusCircle, Edit3 } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

export default function InsertPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("edit");
  const isEditMode = !!companyId;

  const handleSuccess = () => {
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <motion.button
            onClick={handleCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-8 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              {isEditMode ? (
                <Edit3 className="w-16 h-16 text-amber-500" />
              ) : (
                <PlusCircle className="w-16 h-16 text-emerald-500" />
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-slate-900 bg-clip-text text-transparent mb-3">
                  {isEditMode ? "Edit Company" : "Add New Company"}
                </h1>
                <p className="text-xl text-slate-600 font-medium">
                  {isEditMode
                    ? "Update company information"
                    : "Fill in company details"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <CompanyForm
          companyId={companyId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </main>
  );
}
