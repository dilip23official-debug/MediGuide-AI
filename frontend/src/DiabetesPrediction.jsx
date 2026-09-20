import { useState } from "react";
import api from "./api";

function DiabetesPrediction() {
const [formData, setFormData] = useState({
pregnancies: "",
glucose: "",
blood_pressure: "",
skin_thickness: "",
insulin: "",
bmi: "",
diabetes_pedigree: "",
age: "",
});

const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

setLoading(true);
setResult(null);
setError("");

try {
  const token = localStorage.getItem("access_token");

  const response = await api.post(
    "/predictions/diabetes/",
    {
      pregnancies: Number(formData.pregnancies),
      glucose: Number(formData.glucose),
      blood_pressure: Number(formData.blood_pressure),
      skin_thickness: Number(formData.skin_thickness),
      insulin: Number(formData.insulin),
      bmi: Number(formData.bmi),
      diabetes_pedigree: Number(formData.diabetes_pedigree),
      age: Number(formData.age),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setResult(response.data);
} catch (err) {
  console.error("Prediction failed:", err);

  setError(
    err.response?.data?.detail ||
      "Unable to generate prediction."
  );
} finally {
  setLoading(false);
}

};

const resetForm = () => {
setFormData({
pregnancies: "",
glucose: "",
blood_pressure: "",
skin_thickness: "",
insulin: "",
bmi: "",
diabetes_pedigree: "",
age: "",
});

```
setResult(null);
setError("");
```

};

return ( <section className="prediction-section"> <div className="section-title"> <p className="badge">AI Health Prediction</p>


    <h2>Diabetes Risk Prediction</h2>

    <p>
      Enter the required health measurements to generate an
      educational diabetes-risk estimate using our machine
      learning model.
    </p>
  </div>

  <div className="prediction-card">
    <form
      className="prediction-form"
      onSubmit={handleSubmit}
    >
      <div className="prediction-grid">
        <div className="prediction-field">
          <label>Pregnancies</label>
          <input
            type="number"
            name="pregnancies"
            value={formData.pregnancies}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="prediction-field">
          <label>Glucose</label>
          <input
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="prediction-field">
          <label>Blood Pressure</label>
          <input
            type="number"
            name="blood_pressure"
            value={formData.blood_pressure}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="prediction-field">
          <label>Skin Thickness</label>
          <input
            type="number"
            name="skin_thickness"
            value={formData.skin_thickness}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="prediction-field">
          <label>Insulin</label>
          <input
            type="number"
            name="insulin"
            value={formData.insulin}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="prediction-field">
          <label>BMI</label>
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="prediction-field">
          <label>Diabetes Pedigree</label>
          <input
            type="number"
            name="diabetes_pedigree"
            value={formData.diabetes_pedigree}
            onChange={handleChange}
            min="0"
            step="0.001"
            required
          />
        </div>

        <div className="prediction-field">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      </div>

      <div className="prediction-buttons">
        <button
          type="submit"
          className="prediction-btn"
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Predict Diabetes Risk"}
        </button>

        <button
          type="button"
          className="prediction-reset-btn"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>
    </form>

    {error && (
      <div className="prediction-error">
        {error}
      </div>
    )}

    {result && (
      <div className="prediction-result">
        <h3>Prediction Result</h3>

        <div className="result-value">
          {result.result}
        </div>

        <p>
          Model probability:{" "}
          <strong>
            {(result.probability * 100).toFixed(2)}%
          </strong>
        </p>

        <p className="prediction-disclaimer">
          ⚠️ This is an educational risk estimate generated
          by a machine learning model. It is not a medical
          diagnosis.
        </p>
      </div>
    )}
  </div>
</section>

);
}

export default DiabetesPrediction;
