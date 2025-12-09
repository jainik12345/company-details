"use client";

import { useState, useEffect } from "react";
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
    if (companyId) fetchCompanyData();
  }, [companyId]);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch(`/api/company/${companyId}`);
      const json = await res.json();
      if (json.status === "success") setForm(json.data);
    } catch {
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
    if (form.email && !form.email.includes("@")) return "Invalid email format";
    if (form.number && form.number.length < 10) return "Phone number too short";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) return setError(validationError);

    setSubmitting(true);

    try {
      const url = companyId ? `/api/company/${companyId}` : "/api/company";
      const method = companyId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.status === "success") onSuccess();
      else setError(json.error || "Something went wrong");
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-gray-600 mb-3" />
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      {error && (
        <div className="mb-6 text-sm text-red-700 bg-red-100 border border-red-300 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700 font-medium">
            Company Name *
          </label>
          <input
            className="border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:ring"
            placeholder="Enter company name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700 font-medium">
            Location *
          </label>
          <input
            className="border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:ring"
            placeholder="City, Country"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700 font-medium">Email</label>
          <input
            type="email"
            className="border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:ring"
            placeholder="contact@company.com"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </div>

        {/* Number */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            className="border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:ring"
            placeholder="+1 234 567 890"
            value={form.number}
            onChange={(e) => setField("number", e.target.value)}
          />
        </div>

        {/* LinkedIn */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm text-gray-700 font-medium">
            LinkedIn Profile
          </label>
          <input
            className="border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:ring"
            placeholder="https://linkedin.com/company/your-company"
            value={form.linkedin_link}
            onChange={(e) => setField("linkedin_link", e.target.value)}
          />
        </div>

        {/* Website */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm text-gray-700 font-medium">
            Company Website
          </label>
          <input
            className="border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:ring"
            placeholder="https://yourcompany.com"
            value={form.company_website_link}
            onChange={(e) => setField("company_website_link", e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {companyId ? "Update" : "Create"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md text-sm font-semibold hover:bg-gray-300 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
