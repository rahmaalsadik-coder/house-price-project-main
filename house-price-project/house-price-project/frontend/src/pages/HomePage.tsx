import PredictionForm from "../components/PredictionForm";

export default function HomePage() {
  return (
    <div className="home-layout">
      <div className="home-intro">
        <h1>What's this place worth?</h1>
        <p>
          Enter a few details about the property and get an instant price
          estimate, trained on ~170,000 real listings from across India.
        </p>
        <div className="side-note" style={{ marginTop: 28 }}>
          <h3>How the estimate is built</h3>
          <ul>
            <li>Location, area and amenities feed a gradient-boosted model</li>
            <li>Trained on cleaned, deduplicated listing data</li>
            <li>Test-set accuracy: R² ≈ 0.91</li>
          </ul>
        </div>
      </div>
      <PredictionForm />
    </div>
  );
}
