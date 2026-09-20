import { useEffect, useState } from "react";
import api from "./api";

function Reports() {
const [reports, setReports] = useState([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
loadReports();
}, []);

const loadReports = async () => {
try {
const token = localStorage.getItem("access_token");

  const response = await api.get("/reports/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setReports(response.data);
} catch (error) {
  console.error("Failed to load reports:", error);

  setMessage(
    error.response?.data?.detail ||
      "Failed to load medical reports."
  );
} finally {
  setLoading(false);
}
```

};

const deleteReport = async (id) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this report?"
);

```
if (!confirmDelete) {
  return;
}

try {
  const token = localStorage.getItem("access_token");

  await api.delete(`/reports/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setReports((previous) =>
    previous.filter((report) => report.id !== id)
  );

  setMessage("Report deleted successfully. ✅");
} catch (error) {
  console.error("Delete failed:", error);

  setMessage(
    error.response?.data?.detail ||
      "Failed to delete report."
  );
}

};

if (loading) {
return ( <section className="reports-dashboard"> <div className="section-title"> <p className="badge">Medical Reports</p> <h2>Your Reports</h2> </div>

    <p>Loading reports...</p>
  </section>
);

}

return ( <section className="reports-dashboard"> <div className="section-title"> <p className="badge">Medical Reports</p> <h2>Your Reports</h2>

    <p>
      View and manage your uploaded medical reports.
    </p>
  </div>

  {message && (
    <p className="report-message">
      {message}
    </p>
  )}

  {reports.length === 0 ? (
    <div className="empty-reports">
      <div className="feature-icon">📄</div>

      <h3>No reports yet</h3>

      <p>
        Upload your first medical report to see it here.
      </p>
    </div>
  ) : (
    <div className="reports-grid">
      {reports.map((report) => (
        <div
          className="report-card"
          key={report.id}
        >
          <div className="report-card-header">
            <div className="report-icon">
              📄
            </div>

            <div>
              <h3>{report.title}</h3>

              <p>
                Uploaded:{" "}
                {new Date(
                  report.uploaded_at
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="report-status">
            {report.ai_summary ? (
              <span>🤖 AI Analysis Available</span>
            ) : (
              <span>⏳ Awaiting AI Analysis</span>
            )}
          </div>

          <div className="report-actions">
            <a
              href={`http://127.0.0.1:8000${report.file}`}
              target="_blank"
              rel="noreferrer"
              className="report-view-btn"
            >
              View PDF
            </a>

            <button
              className="report-delete-btn"
              onClick={() =>
                deleteReport(report.id)
              }
            >
              Delete
            </button>
          </div>

          {report.ai_summary && (
            <details className="report-summary">
              <summary>
                View AI Summary
              </summary>

              <p>{report.ai_summary}</p>
            </details>
          )}
        </div>
      ))}
    </div>
  )}
</section>

);
}

export default Reports;
