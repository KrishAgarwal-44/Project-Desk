// src/pages/head/Form3.jsx
import React, { useState } from "react";
import { createForm3ForAllProjects } from "../../services/headService"; // ✅ your service function

const Form3 = () => {
  const [weeks, setWeeks] = useState(
    Array.from({ length: 11 }, (_, i) => ({
      weekNumber: i + 1,
      fromDate: "",
      toDate: "",
    }))
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const newWeeks = [...weeks];
    newWeeks[index][field] = value;
    setWeeks(newWeeks);
  };

  const handleSubmit = async () => {
    for (let w of weeks) {
      if (!w.fromDate || !w.toDate) {
        alert(`Please fill both From and To dates for Week ${w.weekNumber}`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await createForm3ForAllProjects(weeks); // ✅ service call
      alert(res.message);
    } catch (err) {
      console.error(err);
      alert("Error submitting weeks");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Set Week Dates for Form3
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weeks.map((week, index) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              Week {week.weekNumber}
            </h3>

            <div className="flex gap-4 items-center">
              <label className="flex flex-col flex-1">
                From
                <input
                  type="date"
                  value={week.fromDate}
                  onChange={(e) =>
                    handleChange(index, "fromDate", e.target.value)
                  }
                  className="border px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </label>

              <label className="flex flex-col flex-1">
                To
                <input
                  type="date"
                  value={week.toDate}
                  onChange={(e) => handleChange(index, "toDate", e.target.value)}
                  className="border px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          {loading ? "Submitting..." : "Submit Dates"}
        </button>
      </div>
    </div>
  );
};

export default Form3;