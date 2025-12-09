"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";

const emptyForm = {
  name: "",
  location: "",
  email: "",
  number: "",
  linkedin_link: "",
  company_website_link: "",
};

const CompanyForm = ({ companyId = null, onSuccess, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(!!companyId);

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
    } else {
      setForm(emptyForm);
    }
  }, [companyId]);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch(`/api/company/${companyId}`);
      const json = await res.json();
      if (json.status === "success") {
        setForm(json.data);
      }
    } catch (err) {
      setError("Failed to load company data");
    } finally {
      setLoadingData(false);
    }
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Company name is required";
    if (!form.location.trim()) return "Location is required";
    if (form.email && !form.email.includes("@"))
      return "Please enter valid email";
    if (form.number && form.number.length < 10) return "Phone number too short";
    if (form.linkedin_link && !form.linkedin_link.startsWith("http"))
      return "LinkedIn must start with http/https";
    if (
      form.company_website_link &&
      !form.company_website_link.startsWith("http")
    )
      return "Website must start with http/https";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = companyId ? `/api/company/${companyId}` : "/api/company";
      const method = companyId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.status === "success") {
        onSuccess();
      } else {
        setError(json.error || "Operation failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-slate-200 flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-slate-600 font-medium">
            Loading company data...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-4xl mx-auto border border-slate-200"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border-2 border-red-200 text-red-800 p-6 rounded-2xl mb-8 flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            !
          </div>
          {error}
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Company Name */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="w-5 h-5 text-blue-500">🏢</span>
            Company Name *
          </label>
          <input
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-slate-400"
            placeholder="Enter company name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="w-5 h-5 text-green-500">📍</span>
            Location *
          </label>
          <input
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg placeholder-slate-400"
            placeholder="City, Country"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="w-5 h-5 text-purple-500">📧</span>
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg placeholder-slate-400"
            placeholder="contact@company.com"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="w-5 h-5 text-orange-500">📞</span>
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg placeholder-slate-400"
            placeholder="+1 (555) 123-4567"
            value={form.number}
            onChange={(e) => setField("number", e.target.value)}
          />
        </div>

        {/* LinkedIn */}
        <div className="lg:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="w-5 h-5 text-blue-500">💼</span>
            LinkedIn Profile
          </label>
          <input
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-slate-400"
            placeholder="https://linkedin.com/company/your-company"
            value={form.linkedin_link}
            onChange={(e) => setField("linkedin_link", e.target.value)}
          />
        </div>

        {/* Website */}
        <div className="lg:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="w-5 h-5 text-indigo-500">🌐</span>
            Company Website
          </label>
          <input
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg placeholder-slate-400"
            placeholder="https://yourcompany.com"
            value={form.company_website_link}
            onChange={(e) => setField("company_website_link", e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 pt-6">
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2 border-transparent hover:border-emerald-400"
          >
            {submitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                {companyId ? "Update Company" : "Create Company"}
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-slate-300 hover:to-slate-400 transition-all duration-300 border-2 border-slate-300 flex items-center justify-center gap-3 hover:border-slate-400"
          >
            <X className="w-6 h-6" />
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CompanyForm;
