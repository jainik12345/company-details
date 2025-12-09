"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  Loader2,
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  Linkedin,
  Globe,
  Plus,
} from "lucide-react";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/company");
      const json = await res.json();
      if (json.status === "success") {
        setCompanies(json.data);
      } else {
        setError(json.error || "Failed to load companies");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this company? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`/api/company/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.status === "success") {
        fetchCompanies();
      } else {
        setError(json.error || "Delete failed");
      }
    } catch (err) {
      setError("Delete operation failed. Please try again.");
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-2xl p-16 text-center border-4 border-red-200/50 backdrop-blur-xl"
      >
        <div className="w-24 h-24 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border-4 border-red-200">
          <Trash2 className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-red-800 mb-4">
          Error Loading Companies
        </h2>
        <p className="text-xl text-red-700 mb-8 max-w-md mx-auto leading-relaxed">
          {error}
        </p>
        <motion.button
          onClick={fetchCompanies}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-3 mx-auto"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          Retry Loading
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg" />
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              Companies List
            </h2>
            <span className="text-lg text-slate-500 font-medium bg-slate-100/50 px-3 py-1 rounded-full">
              {companies.length}{" "}
              {companies.length === 1 ? "company" : "companies"}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-24 flex flex-col items-center justify-center">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500/20 rounded-full animate-ping blur-xl" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-slate-600 font-bold mt-6"
          >
            Loading companies...
          </motion.p>
          <p className="text-slate-500 mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      ) : companies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-24 text-center"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-dashed border-slate-300">
            <Mail className="w-20 h-20 text-slate-400" />
          </div>
          <h3 className="text-4xl font-black text-slate-700 mb-4">
            No companies yet
          </h3>
          <p className="text-xl text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Your company database is empty. Add your first company using the
            Add New Company button in the dashboard above.
          </p>
          <a
            href="/insert"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-green-700 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] border-2 border-transparent hover:border-emerald-400"
          >
            <Plus className="w-6 h-6" />
            Add First Company
          </a>
        </motion.div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                <tr>
                  <th className="px-8 py-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-8 py-6 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {companies.map((company, index) => (
                    <motion.tr
                      key={company.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-b border-slate-100"
                    >
                      <td className="px-8 py-6 font-bold text-slate-900">
                        {company.name}
                      </td>
                      <td className="px-6 py-6 text-slate-700 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-green-500" />
                          {company.location}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          {company.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              {company.email}
                            </div>
                          )}
                          {company.number && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4" />
                              {company.number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          {company.linkedin_link && (
                            <a
                              href={company.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                              <span>LinkedIn</span>
                              <ExternalLink className="w-4 h-4 ml-auto" />
                            </a>
                          )}
                          {company.company_website_link && (
                            <a
                              href={company.company_website_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
                            >
                              <Globe className="w-4 h-4" />
                              <span>Website</span>
                              <ExternalLink className="w-4 h-4 ml-auto" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <motion.a
                            href={`/insert?edit=${company.id}`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center"
                          >
                            <Edit3 className="w-5 h-5" />
                          </motion.a>
                          <motion.button
                            onClick={() => handleDelete(company.id)}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-6 space-y-6">
            <AnimatePresence>
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex-1 pr-4">
                      {company.name}
                    </h3>
                    <div className="flex gap-2">
                      <a
                        href={`/insert?edit=${company.id}`}
                        className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl hover:shadow-xl shadow-lg"
                      >
                        <Edit3 className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:shadow-xl shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-2 font-bold text-slate-700">
                        <MapPin className="w-5 h-5 text-green-500" />
                        Location
                      </div>
                      <p className="text-slate-800">{company.location}</p>
                    </div>

                    <div className="space-y-3">
                      {company.email && (
                        <div className="flex items-start gap-2 p-3 bg-slate-100/50 rounded-2xl">
                          <Mail className="w-5 h-5 text-purple-500 mt-0.5" />
                          <span className="font-medium">{company.email}</span>
                        </div>
                      )}
                      {company.number && (
                        <div className="flex items-start gap-2 p-3 bg-slate-100/50 rounded-2xl">
                          <Phone className="w-5 h-5 text-orange-500 mt-0.5" />
                          <span className="font-medium">{company.number}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                    {company.linkedin_link && (
                      <a
                        href={company.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl text-sm font-semibold transition-all"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {company.company_website_link && (
                      <a
                        href={company.company_website_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold transition-all"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CompanyTable;
