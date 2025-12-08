"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emptyForm = {
  name: "",
  location: "",
  email: "",
  number: "",
  linkedin_link: "",
  company_website_link: "",
};

const CompanyManager = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("/api/company");
      const json = await res.json();
      if (json.status === "success") setList(json.data);
      else setError(json.error || "Failed to load");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Name is required";
    if (form.email && !form.email.includes("@")) return "Invalid email";
    if (form.linkedin_link && !form.linkedin_link.startsWith("http"))
      return "Invalid LinkedIn link";
    if (
      form.company_website_link &&
      !form.company_website_link.startsWith("http")
    )
      return "Invalid website link";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    setSubmitting(true);
    setError("");

    const url = editing ? `/api/company/${editing}` : "/api/company";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (json.status === "success") {
        await fetchList();
        resetForm();
      } else {
        setError(json.error || "Server error");
      }
    } catch (err) {
      setError(err.message);
    }

    setSubmitting(false);
  }

  async function handleEdit(id) {
    try {
      const res = await fetch(`/api/company/${id}`);
      const json = await res.json();

      if (json.status === "success") {
        setEditing(id);
        setForm({ ...emptyForm, ...json.data });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(json.error || "Cannot fetch company");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this company?")) return;

    try {
      const res = await fetch(`/api/company/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (json.status === "success") {
        await fetchList();
      } else {
        setError(json.error || "Delete failed");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {editing ? "Edit Company" : "Add Company"}
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {error && (
          <motion.div
            className="text-red-600 bg-red-100 p-3 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(emptyForm).map((key) => (
            <input
              key={key}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={key.replace(/_/g, " ").toUpperCase()}
              value={form[key]}
              onChange={(e) => setField(key, e.target.value)}
              type={
                key === "email" ? "email" : key === "number" ? "tel" : "text"
              }
            />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : editing ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </motion.form>

      <h2 className="text-2xl font-semibold mb-4 text-center">Companies</h2>

      {loading ? (
        <div className="text-center py-10">
          <svg
            className="animate-spin h-10 w-10 mx-auto text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="mt-3 text-blue-700">Loading companies...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No companies yet</div>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full text-left border border-gray-300 hidden md:table">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Links</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {list.map((c) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="border-b hover:bg-blue-50"
                  >
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4">{c.location}</td>
                    <td className="py-2 px-4 break-words max-w-xs">
                      {c.email || "-"}
                    </td>
                    <td className="py-2 px-4">{c.number || "-"}</td>
                    <td className="py-2 px-4 space-x-3">
                      {c.linkedin_link && (
                        <a
                          href={c.linkedin_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          LinkedIn
                        </a>
                      )}
                      {c.company_website_link && (
                        <a
                          href={c.company_website_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Website
                        </a>
                      )}
                    </td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(c.id)}
                        className="bg-yellow-400 rounded px-3 py-1 hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            <AnimatePresence>
              {list.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded p-4 shadow-sm bg-white"
                >
                  <h3 className="font-semibold text-lg">{c.name}</h3>
                  <p className="text-gray-600">{c.location}</p>
                  <p>
                    {c.email && (
                      <span className="block">
                        <strong>Email:</strong> {c.email}
                      </span>
                    )}
                    {c.number && (
                      <span className="block">
                        <strong>Phone:</strong> {c.number}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 space-x-4">
                    {c.linkedin_link && (
                      <a
                        href={c.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {c.company_website_link && (
                      <a
                        href={c.company_website_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Website
                      </a>
                    )}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(c.id)}
                      className="flex-1 bg-yellow-400 rounded py-2 hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex-1 bg-red-500 text-white rounded py-2 hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
