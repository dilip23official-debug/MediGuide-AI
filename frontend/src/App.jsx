import { useState } from "react";
import "./App.css";
import Login from "./Login";
import UploadReport from "./UploadReport";
import Chat from "./Chat";
import Reports from "./Reports";
import DiabetesPrediction from "./DiabetesPrediction";

function App() {
const [isLoggedIn, setIsLoggedIn] = useState(
!!localStorage.getItem("access_token")
);

const handleLogout = () => {
localStorage.removeItem("access_token");
localStorage.removeItem("refresh_token");
setIsLoggedIn(false);
};

const scrollToChat = () => {
document
.getElementById("chat-section")
?.scrollIntoView({ behavior: "smooth" });
};

const scrollToReports = () => {
document
.getElementById("reports-section")
?.scrollIntoView({ behavior: "smooth" });
};

const scrollToPrediction = () => {
document
.getElementById("prediction-section")
?.scrollIntoView({ behavior: "smooth" });
};

if (!isLoggedIn) {
return <Login onLogin={() => setIsLoggedIn(true)} />;
}

return ( <div className="app"> <header className="navbar"> <div className="logo">
Medi<span>Guide</span> AI </div>

```
    <nav>
      <a href="#dashboard">Dashboard</a>

      <a
        href="#reports-section"
        onClick={(e) => {
          e.preventDefault();
          scrollToReports();
        }}
      >
        Reports
      </a>

      <a
        href="#chat-section"
        onClick={(e) => {
          e.preventDefault();
          scrollToChat();
        }}
      >
        AI Chat
      </a>

      <a
        href="#prediction-section"
        onClick={(e) => {
          e.preventDefault();
          scrollToPrediction();
        }}
      >
        Predictions
      </a>
    </nav>

    <button
      className="profile-btn"
      onClick={handleLogout}
    >
      Logout
    </button>
  </header>

  <main className="hero" id="dashboard">
    <section className="hero-content">
      <p className="badge">
        AI-Powered Healthcare Assistant
      </p>

      <h1>
        Understand your health
        <span> with MediGuide AI</span>
      </h1>

      <p className="description">
        Upload medical reports, understand important findings,
        and interact with an AI assistant using simple language.
      </p>

      <div className="hero-buttons">
        <button
          className="primary-btn"
          onClick={() =>
            document
              .getElementById("upload-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Upload Report
        </button>

        <button
          className="secondary-btn"
          onClick={scrollToChat}
        >
          Start AI Chat
        </button>
      </div>
    </section>

    <section className="health-card">
      <div className="card-header">
        <div>
          <p className="small-text">
            MediGuide AI
          </p>

          <h2>Health Overview</h2>
        </div>

        <div className="status-dot"></div>
      </div>

      <div className="health-items">
        <div className="health-item">
          <div className="icon">📄</div>

          <div>
            <h3>Medical Reports</h3>
            <p>Upload & understand reports</p>
          </div>
        </div>

        <div className="health-item">
          <div className="icon">🤖</div>

          <div>
            <h3>AI Assistant</h3>
            <p>Ask health-related questions</p>
          </div>
        </div>

        <div className="health-item">
          <div className="icon">📊</div>

          <div>
            <h3>Predictions</h3>
            <p>Explore health risk information</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <section id="upload-section">
    <UploadReport />
  </section>

  <section id="reports-section">
    <Reports />
  </section>

  <section id="chat-section">
    <Chat />
  </section>

  <section id="prediction-section">
    <DiabetesPrediction />
  </section>

  <section
    className="features"
    id="predictions"
  >
    <div className="section-title">
      <p className="badge">
        What MediGuide Offers
      </p>

      <h2>
        Your health information, simplified.
      </h2>
    </div>

    <div className="feature-grid">
      <div className="feature-card">
        <div className="feature-icon">
          📄
        </div>

        <h3>Report Analysis</h3>

        <p>
          Upload PDF medical reports and receive
          easy-to-understand explanations.
        </p>
      </div>

      <div className="feature-card">
        <div className="feature-icon">
          🤖
        </div>

        <h3>AI Health Chat</h3>

        <p>
          Have educational conversations with your
          local AI healthcare assistant.
        </p>
      </div>

      <div className="feature-card">
        <div className="feature-icon">
          📊
        </div>

        <h3>Health Predictions</h3>

        <p>
          Explore machine-learning based health
          prediction features.
        </p>
      </div>
    </div>
  </section>

  <footer>
    <p>
      © 2026 MediGuide AI · Educational information only.
      Not a substitute for professional medical advice.
    </p>
  </footer>
</div>

);
}

export default App;
