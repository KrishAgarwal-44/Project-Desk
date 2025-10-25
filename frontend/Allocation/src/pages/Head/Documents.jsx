// src/pages/head/Documents.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  downloadDocument,
} from "../../services/headService";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [title, setTitle] = useState("");

  const fileInputRef = useRef(null);

  // Fetch all documents
  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error("Error fetching documents:", err);
      alert("Failed to fetch documents.");
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !title) {
      alert("Please provide a title and select a file.");
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(file, title);
      alert("Document uploaded successfully!");
      setTitle("");
      fileInputRef.current.value = "";
      fetchDocuments();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocument(id);
      alert("Document deleted successfully!");
      fetchDocuments();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete document.");
    }
  };

  // Handle download
  const handleDownload = async (id, fileName) => {
    try {
      await downloadDocument(id, fileName);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download document.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Manage Documents</h2>

      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2"
          disabled={uploading}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx,.xlsx,.xls"
          onChange={handleUpload}
          disabled={uploading}
          className="border p-2 rounded w-full"
        />
        {uploading && <p className="mt-2 text-blue-600">Uploading...</p>}
      </div>

      {/* Documents List */}
      <h3 className="text-xl font-semibold mb-2">Uploaded Documents</h3>
      {loadingDocs ? (
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{doc.title}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleDownload(doc._id, doc.fileName)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Documents;

