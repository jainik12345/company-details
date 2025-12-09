"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Edit3,
  Trash2,
} from "lucide-react";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, selectedLocation, companies]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/company");
      const data = await res.json();

      if (data.status === "success") {
        setCompanies(data.data);

        // Extract unique locations
        const uniqueLocations = [...new Set(data.data.map((c) => c.location))];
        setLocations(uniqueLocations);
      } else {
        setError(data.error || "Failed to load companies");
      }
    } catch {
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let list = [...companies];

    // Search filter (name, email, number)
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          (c.email || "").toLowerCase().includes(s) ||
          (c.number || "").toLowerCase().includes(s)
      );
    }

    // Location filter
    if (selectedLocation) {
      list = list.filter((c) => c.location === selectedLocation);
    }

    setFiltered(list);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this company?")) return;

    try {
      const res = await fetch(`/api/company/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.status === "success") {
        setCompanies((prev) => prev.filter((c) => c.id !== id));
      } else {
        setError(data.error || "Delete failed");
      }
    } catch {
      setError("Delete failed. Try again.");
    }
  };

  // ---------------- UI BELOW ------------------

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Top Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by company, email, number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 border rounded-lg w-full sm:w-1/3 focus:border-blue-500"
        />

        {/* Location Selector */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-3 border rounded-lg w-full sm:w-48 focus:border-blue-500"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Companies</h2>
        <p className="text-gray-500 text-sm">{filtered.length} results</p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="p-12 flex items-center justify-center flex-col">
          <Loader2 className="w-10 h-10 text-gray-500 animate-spin mb-3" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            No matching companies
          </h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full  text-sm border-collapse border-2 ">
              <thead className="bg-gray-50  ">
                <tr>
                  <th className="px-6 py-4 text-left border-r truncate font-extrabold text-gray-700">
                    No.
                  </th>
                  <th className="px-6 py-4 text-left border-r truncate font-extrabold text-gray-700">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left border-r truncate font-extrabold text-gray-700">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left border-r truncate font-extrabold text-gray-700">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left border-r truncate font-extrabold text-gray-700">
                    Links
                  </th>
                  <th className="px-6 py-4 text-center border-r truncate font-extrabold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y border-2 bg-white">
                {filtered.map((c, index) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-r font-medium">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 border-r font-medium">{c.name}</td>

                    <td className="px-6 py-4 border-r  text-gray-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {c.location}
                      </div>
                    </td>

                    <td className="px-6 py-4 border-r text-gray-700">
                      <div className="space-y-1">
                        {c.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {c.email}
                          </div>
                        )}
                        {c.number && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {c.number}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 border-r">
                      <div className="space-y-1">
                        {c.linkedin_link && (
                          <a
                            href={c.linkedin_link}
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            <Linkedin className="w-4 h-4" /> LinkedIn
                          </a>
                        )}

                        {c.company_website_link && (
                          <a
                            href={c.company_website_link}
                            className="flex items-center gap-2 text-emerald-600 hover:underline"
                          >
                            <Globe className="w-4 h-4" /> Website
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <a
                          href={`/insert?edit=${c.id}`}
                          className="p-2 border-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                        >
                          <Edit3 className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 border-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden p-4 space-y-4">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="border rounded-xl p-5 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <div className="flex gap-2">
                    <a
                      href={`/insert?edit=${c.id}`}
                      className="p-2 bg-yellow-400 text-white rounded-md"
                    >
                      <Edit3 className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 bg-red-500 text-white rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {c.location}
                </div>

                <div className="space-y-1 text-sm text-gray-700 mb-3">
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {c.email}
                    </div>
                  )}
                  {c.number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {c.number}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-3 border-t">
                  {c.linkedin_link && (
                    <a
                      href={c.linkedin_link}
                      className="text-blue-600 text-sm flex items-center gap-1"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {c.company_website_link && (
                    <a
                      href={c.company_website_link}
                      className="text-emerald-600 text-sm flex items-center gap-1"
                    >
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyTable;
