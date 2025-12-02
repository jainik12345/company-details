"use client";
import { useState, useEffect } from "react";

const AboutCounting = () => {
  const [partners, setPartners] = useState("");
  const [booking, setBooking] = useState("");
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    fetch("/api/aboutCounting")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setExisting(data.data);
          setPartners(data.data.partners);
          setBooking(data.data.booking);
        }
      });
  }, []);

  const handleSubmit = async () => {
    const method = existing ? "PUT" : "POST";

    const res = await fetch("/api/aboutCounting", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partners, booking }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="p-4">
      <h2>About Counting</h2>

      <input
        type="number"
        placeholder="Partners"
        value={partners}
        onChange={(e) => setPartners(e.target.value)}
        className="border p-2 block"
      />

      <input
        type="number"
        placeholder="Booking"
        value={booking}
        onChange={(e) => setBooking(e.target.value)}
        className="border p-2 block mt-2"
      />

      <button
        onClick={handleSubmit}
        className="mt-3 px-4 py-2 bg-blue-600 text-white"
      >
        {existing ? "Update" : "Create"}
      </button>
    </div>
  );
};

export default AboutCounting;
