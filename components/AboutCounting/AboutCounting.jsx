"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BE_URL from "@/app/config";

const AboutCounting = () => {
  const [partners, setPartners] = useState("");
  const [booking, setBooking] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [isUpdate, setIsUpdate] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BE_URL}/aboutCounting`);
      const data = res.data.data;

      if (data) {
        setPartners(data.partners);
        setBooking(data.booking);
        setIsUpdate(true);
      }
    } catch (err) {
      console.log("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!partners || !booking) {
      setMsg("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const payload = { partners, booking };

      let res;

      if (isUpdate) {
        res = await axios.put(`${BE_URL}/aboutCounting`, payload);
        setMsg("Updated successfully.");
      } else {
        res = await axios.post(`${BE_URL}/aboutCounting`, payload);
        setMsg("Inserted successfully.");
        setIsUpdate(true);
      }
    } catch (err) {
      console.log(err.response?.data);
      setMsg(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isUpdate ? "Update About Counting" : "Add About Counting"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 border rounded-lg shadow"
      >
        <div className="flex flex-col gap-1">
          <label className="font-medium">Partners</label>
          <input
            type="number"
            value={partners}
            onChange={(e) => setPartners(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter partners count"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">Booking</label>
          <input
            type="number"
            value={booking}
            onChange={(e) => setBooking(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter booking count"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : isUpdate ? "Update" : "Insert"}
        </button>
      </form>

      {msg && <p className="mt-4 text-green-700 font-medium">{msg}</p>}
    </div>
  );
};

export default AboutCounting;
