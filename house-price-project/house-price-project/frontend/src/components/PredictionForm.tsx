import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLocations, predictPrice, ApiError } from "../api/predictionClient";
import {
  FACING_OPTIONS,
  FURNISHING_OPTIONS,
  OWNERSHIP_OPTIONS,
  TRANSACTION_OPTIONS,
  type Facing,
  type Furnishing,
  type Ownership,
  type Transaction,
} from "../types/prediction";

interface FormState {
  location: string;
  area_sqft: string;
  floor_num: string;
  bathroom_num: string;
  balcony_num: string;
  carpark_num: string;
  furnishing: Furnishing | "";
  transaction: Transaction | "";
  ownership: Ownership | "";
  facing: Facing | "";
}

const initialState: FormState = {
  location: "",
  area_sqft: "",
  floor_num: "",
  bathroom_num: "",
  balcony_num: "",
  carpark_num: "",
  furnishing: "",
  transaction: "",
  ownership: "",
  facing: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.location.trim()) errors.location = "Pick a location.";

  const area = Number(form.area_sqft);
  if (!form.area_sqft) errors.area_sqft = "Enter the area.";
  else if (Number.isNaN(area) || area <= 0) errors.area_sqft = "Area must be greater than 0.";

  const bathrooms = Number(form.bathroom_num);
  if (!form.bathroom_num) errors.bathroom_num = "Enter the number of bathrooms.";
  else if (Number.isNaN(bathrooms) || bathrooms < 1) errors.bathroom_num = "Must be at least 1.";

  if (form.floor_num && Number.isNaN(Number(form.floor_num))) {
    errors.floor_num = "Enter a whole number.";
  }
  if (form.balcony_num && (Number.isNaN(Number(form.balcony_num)) || Number(form.balcony_num) < 0)) {
    errors.balcony_num = "Enter a whole number, 0 or more.";
  }
  if (form.carpark_num && (Number.isNaN(Number(form.carpark_num)) || Number(form.carpark_num) < 0)) {
    errors.carpark_num = "Enter a whole number, 0 or more.";
  }

  return errors;
}

export default function PredictionForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await predictPrice({
        location: form.location,
        area_sqft: Number(form.area_sqft),
        floor_num: form.floor_num ? Number(form.floor_num) : null,
        bathroom_num: Number(form.bathroom_num),
        balcony_num: form.balcony_num ? Number(form.balcony_num) : null,
        carpark_num: form.carpark_num ? Number(form.carpark_num) : null,
        furnishing: form.furnishing || null,
        transaction: form.transaction || null,
        ownership: form.ownership || null,
        facing: form.facing || null,
      });

      navigate("/result", {
        state: {
          predictedPrice: result.predicted_price,
          input: form,
        },
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className={`form-field form-field--full ${errors.location ? "form-field--error" : ""}`}>
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          >
            <option value="">Select a city / locality</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.location && <span className="form-field__error">{errors.location}</span>}
        </div>

        <div className={`form-field ${errors.area_sqft ? "form-field--error" : ""}`}>
          <label htmlFor="area_sqft">Area (sqft)</label>
          <input
            id="area_sqft"
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 1150"
            value={form.area_sqft}
            onChange={(e) => updateField("area_sqft", e.target.value)}
          />
          {errors.area_sqft && <span className="form-field__error">{errors.area_sqft}</span>}
        </div>

        <div className={`form-field ${errors.bathroom_num ? "form-field--error" : ""}`}>
          <label htmlFor="bathroom_num">Bathrooms</label>
          <input
            id="bathroom_num"
            type="number"
            min={1}
            placeholder="e.g. 2"
            value={form.bathroom_num}
            onChange={(e) => updateField("bathroom_num", e.target.value)}
          />
          {errors.bathroom_num && <span className="form-field__error">{errors.bathroom_num}</span>}
        </div>

        <div className={`form-field ${errors.floor_num ? "form-field--error" : ""}`}>
          <label htmlFor="floor_num">Floor (0 = ground)</label>
          <input
            id="floor_num"
            type="number"
            placeholder="e.g. 4"
            value={form.floor_num}
            onChange={(e) => updateField("floor_num", e.target.value)}
          />
          {errors.floor_num && <span className="form-field__error">{errors.floor_num}</span>}
        </div>

        <div className={`form-field ${errors.balcony_num ? "form-field--error" : ""}`}>
          <label htmlFor="balcony_num">Balconies</label>
          <input
            id="balcony_num"
            type="number"
            min={0}
            placeholder="e.g. 2"
            value={form.balcony_num}
            onChange={(e) => updateField("balcony_num", e.target.value)}
          />
          {errors.balcony_num && <span className="form-field__error">{errors.balcony_num}</span>}
        </div>

        <div className={`form-field ${errors.carpark_num ? "form-field--error" : ""}`}>
          <label htmlFor="carpark_num">Car parking spots</label>
          <input
            id="carpark_num"
            type="number"
            min={0}
            placeholder="e.g. 1"
            value={form.carpark_num}
            onChange={(e) => updateField("carpark_num", e.target.value)}
          />
          {errors.carpark_num && <span className="form-field__error">{errors.carpark_num}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="furnishing">Furnishing</label>
          <select
            id="furnishing"
            value={form.furnishing}
            onChange={(e) => updateField("furnishing", e.target.value as Furnishing)}
          >
            <option value="">Not specified</option>
            {FURNISHING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="transaction">Transaction type</label>
          <select
            id="transaction"
            value={form.transaction}
            onChange={(e) => updateField("transaction", e.target.value as Transaction)}
          >
            <option value="">Not specified</option>
            {TRANSACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="ownership">Ownership</label>
          <select
            id="ownership"
            value={form.ownership}
            onChange={(e) => updateField("ownership", e.target.value as Ownership)}
          >
            <option value="">Not specified</option>
            {OWNERSHIP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="facing">Facing</label>
          <select
            id="facing"
            value={form.facing}
            onChange={(e) => updateField("facing", e.target.value as Facing)}
          >
            <option value="">Not specified</option>
            {FACING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Estimating..." : "Estimate price"}
        </button>
        {submitting && <span className="spinner" aria-hidden="true" />}
      </div>

      {submitError && <div className="form-error-banner">{submitError}</div>}
    </form>
  );
}
