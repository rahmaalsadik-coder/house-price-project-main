import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-header__mark" to="/">
            Ghar Estimate
          </Link>
          <span className="site-header__tagline">Indian residential price predictor</span>
        </div>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        Estimates are model-generated from historical listing data and are not a formal valuation.
      </footer>
    </BrowserRouter>
  );
}
