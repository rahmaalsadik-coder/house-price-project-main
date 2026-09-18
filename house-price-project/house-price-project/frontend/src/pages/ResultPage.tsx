import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Facing, Furnishing, Ownership, Transaction } from "../types/prediction";

interface ResultState {
  predictedPrice: number;
  input: {
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
  };
}

function formatIndianPrice(value: number): string {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)} Lac`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState | null;

  if (!state) {
    return (
      <div className="state-message">
        <h2>No estimate to show</h2>
        <p>Fill in the property form first to get a price estimate.</p>
        <div style={{ marginTop: 18 }}>
          <Link className="btn-secondary" to="/">
            Go to the form
          </Link>
        </div>
      </div>
    );
  }

  const { predictedPrice, input } = state;

  return (
    <div className="slip">
      <div className="slip__header">
        <div className="slip__label">Estimated market price</div>
        <div className="slip__price">{formatIndianPrice(predictedPrice)}</div>
      </div>
      <div className="slip__body">
        <dl>
          <div className="slip__row">
            <dt>Location</dt>
            <dd>{input.location || "—"}</dd>
          </div>
          <div className="slip__row">
            <dt>Area</dt>
            <dd>{input.area_sqft} sqft</dd>
          </div>
          <div className="slip__row">
            <dt>Bathrooms</dt>
            <dd>{input.bathroom_num}</dd>
          </div>
          <div className="slip__row">
            <dt>Floor</dt>
            <dd>{input.floor_num || "—"}</dd>
          </div>
          <div className="slip__row">
            <dt>Balconies</dt>
            <dd>{input.balcony_num || "—"}</dd>
          </div>
          <div className="slip__row">
            <dt>Car parking</dt>
            <dd>{input.carpark_num || "—"}</dd>
          </div>
          <div className="slip__row">
            <dt>Furnishing</dt>
            <dd>{input.furnishing || "—"}</dd>
          </div>
          <div className="slip__row">
            <dt>Transaction</dt>
            <dd>{input.transaction || "—"}</dd>
          </div>
        </dl>

        <div className="slip__actions">
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Estimate another property
          </button>
        </div>
      </div>
    </div>
  );
}
