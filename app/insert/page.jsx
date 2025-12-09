"use client";

import CompanyForm from "@/components/CompanyManager/CompanyForm";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

const InsertPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("edit");
  const isEditMode = !!companyId;

  const handleSuccess = () => router.push("/");
  const handleCancel = () => router.push("/");

  return (
    <main className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center cursor-pointer gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4  h-4" />
          Back
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Company" : "Add Company"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode
              ? "Modify the company details below."
              : "Enter the company information below."}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 border">
          <CompanyForm
            companyId={companyId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </main>
  );
};

export default InsertPage;
