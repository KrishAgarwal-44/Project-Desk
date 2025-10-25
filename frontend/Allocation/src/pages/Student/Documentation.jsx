import React, { useEffect, useState } from "react";
import { getDocuments, downloadDocument } from "../../services/studentService";

const Documentation = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = async (id, fileName) => {
    try {
      await downloadDocument(id, fileName);
    } catch (err) {
      console.error(err);
      alert("Failed to download document.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Available Documents</h2>

      {loading ? (
        <p>Loading...</p>
      ) : documents.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{doc.fileName}</span>
              <button
                onClick={() => handleDownload(doc._id, doc.fileName)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Documentation;
