import React, { useEffect, useState } from "react";
import { getMentorList } from "../../services/studentService";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const data = await getMentorList();
        setMentors(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch mentor list.");
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  if (loading) return <p>Loading mentor list...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Mentor List</h2>
      {mentors.length === 0 ? (
        <p>No mentors available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Designation</th>
              <th className="border border-gray-300 p-2">Expertise</th>
              <th className="border border-gray-300 p-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{mentor.name}</td>
                <td className="border border-gray-300 p-2">{mentor.email}</td>
                <td className="border border-gray-300 p-2">{mentor.designation}</td>
                <td className="border border-gray-300 p-2">{mentor.expertise}</td>
                <td className="border border-gray-300 p-2">{mentor.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MentorList;

