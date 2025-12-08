"use client";

import { useEffect, useState } from "react";

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {editing ? "Edit Company" : "Add Company"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        {error && <div className="text-red-500">{error}</div>}

        {Object.keys(emptyForm).map((key) => (
          <input
            key={key}
            className="w-full border p-2 rounded"
            placeholder={key.replace(/_/g, " ").toUpperCase()}
            value={form[key]}
            onChange={(e) => setField(key, e.target.value)}
          />
        ))}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {submitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Reset
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Companies</h2>

      {loading ? (
        <div>Loading...</div>
      ) : list.length === 0 ? (
        <div className="text-gray-500">No companies yet</div>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div
              key={c.id}
              className="border rounded p-3 flex justify-between items-start"
            >
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-600">{c.location}</div>

                <div className="text-sm mt-1">
                  {c.email && <span className="mr-3">✉ {c.email}</span>}
                  {c.number && <span className="mr-3">📞 {c.number}</span>}
                </div>

                <div className="text-xs mt-2">
                  {c.linkedin_link && (
                    <a
                      className="underline"
                      href={c.linkedin_link}
                      target="_blank"
                    >
                      LinkedIn
                    </a>
                  )}
                  {c.company_website_link && (
                    <a
                      className="underline ml-3"
                      href={c.company_website_link}
                      target="_blank"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(c.id)}
                  className="px-3 py-1 bg-yellow-400 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
