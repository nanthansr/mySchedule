export function HeroCard() {
  return (
    <div className="hero-card-wrap">
      <div className="hero-card">
        <div className="hc-label">Featured Project</div>
        <div className="hc-title">
          <span style={{ color: "var(--dim)" }}>Cloud-Native</span>
          <br />
          MLOps Pipeline
        </div>
        <div className="hc-sub">
          FastAPI · XGBoost · MLflow · Prometheus · Grafana · CI/CD · 284,807
          transactions at 577:1
        </div>
        <a href="/case-fraud-pipeline.html" className="hc-btn">
          View Case Study →
        </a>
      </div>
    </div>
  );
}
