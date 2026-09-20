import { useState } from "react";
import api from "./api";

function UploadReport() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [reportId, setReportId] = useState(null);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF report.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title || file.name);
    formData.append("file", file);

    try {
      setMessage("Uploading report...");

      const token = localStorage.getItem("access_token");

      const response = await api.post("/reports/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setReportId(response.data.id);
      setMessage(`Report uploaded successfully! ✅ ID: ${response.data.id}`);

      setFile(null);
      setTitle("");
    } catch (error) {
      setMessage(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Upload failed."
      );
    }
  };

  const handleAnalyze = async () => {
    if (!reportId) {
      setMessage("Please upload a report first.");
      return;
    }

    try {
      setMessage("MediGuide AI is analyzing your report...");
      setSummary("");

      const token = localStorage.getItem("access_token");

      const response = await api.post(
        `/reports/${reportId}/summarize/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(response.data.ai_summary);
      setMessage("AI analysis completed! ✅");
    } catch (error) {
      setMessage(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "AI analysis failed."
      );
    }
  };

  return (
    <div className="upload-report">
      <h2>Upload Medical Report</h2>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Report title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">
          Upload Report
        </button>
      </form>

      {reportId && (
        <button onClick={handleAnalyze}>
          Analyze with MediGuide AI 🤖
        </button>
      )}

      {message && <p>{message}</p>}

      {summary && (
        <div className="ai-summary">
          <h3>AI Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default UploadReport;
