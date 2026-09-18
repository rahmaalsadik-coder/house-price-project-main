import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="state-message">
      <h2>Page not found</h2>
      <p>There's nothing here. Head back to the price estimator.</p>
      <div style={{ marginTop: 18 }}>
        <Link className="btn-secondary" to="/">
          Back to the form
        </Link>
      </div>
    </div>
  );
}
