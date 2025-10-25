import React, { useEffect, useState } from "react";
import { getMyForm3, updateForm3Week} from "../../services/studentService";

const Form3Student = () => {
  const [form3, setForm3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingWeek, setSavingWeek] = useState(null);

  useEffect(() => {
    const fetchForm3 = async () => {
      try {
        const data = await getMyForm3();
        setForm3(data);
      } catch (err) {
        console.error("Error fetching Form3:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm3();
  }, []);

  const handleChange = (weekIndex, field, value) => {
    const updatedForm = { ...form3 };
    updatedForm.weeks[weekIndex][field] = value;
    setForm3(updatedForm);
  };

  const handleSaveWeek = async (weekIndex) => {
    setSavingWeek(weekIndex);
    try {
      const weekData = form3.weeks[weekIndex];
      await updateForm3Week(form3._id, weekData.weekNumber, weekData);
      alert(`Week ${weekData.weekNumber} saved successfully!`);
    } catch (err) {
      console.error("Error saving week:", err);
      alert("Failed to save. Try again!");
    } finally {
      setSavingWeek(null);
    }
  };
//   const handleDownloadPDF = async () => {
//     if (!form3) {
//       alert("Form3 data missing. Cannot download PDF.");
//       return;
//     }
  
//     try {
//       const projectId =
//         typeof form3.projectId === "object" ? form3.projectId._id : form3.projectId;
  
//       await downloadForm3PDF(projectId); // ✅ now always a valid string ObjectId
//     } catch (err) {
//       console.error("Error downloading Form-3B PDF:", err);
//       alert(err.message || "Failed to download PDF");
//     }
//   };
  
  if (loading) return <p className="text-gray-500">Loading Form3...</p>;
  if (!form3) return <p className="text-red-500">No Form3 found for you yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Form3 - {form3.projectId?.title}
      </h2>

      <button
        onClick={handleDownloadPDF}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
      >
        Download Form-3B PDF
      </button>

      {form3.weeks.map((week, index) => (
        <div
          key={week.weekNumber}
          className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
        >
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Week {week.weekNumber} (
            {new Date(week.fromDate).toLocaleDateString()} -{" "}
            {new Date(week.toDate).toLocaleDateString()})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Functionality
              </label>
              <input
                type="text"
                value={week.functionality}
                onChange={(e) =>
                  handleChange(index, "functionality", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                value={week.progress}
                min={0}
                max={100}
                onChange={(e) =>
                  handleChange(index, "progress", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 font-medium mb-1">
                Task Details
              </label>
              <textarea
                value={week.taskDetails}
                onChange={(e) =>
                  handleChange(index, "taskDetails", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
              />
            </div>
          </div>

          {/* Mentor Marks */}
          <p className="mb-4">
            <span className="font-medium">Mentor Marks:</span>{" "}
            {week.mentorMarks != null ? (
              <span className="text-green-600 font-semibold">
                {week.mentorMarks}
              </span>
            ) : (
              <span className="text-yellow-600 font-semibold">Pending</span>
            )}
          </p>

          <button
            onClick={() => handleSaveWeek(index)}
            disabled={savingWeek === index}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            {savingWeek === index ? "Saving..." : "Save Week"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Form3Student;