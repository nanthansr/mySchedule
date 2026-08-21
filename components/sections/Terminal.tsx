export function Terminal() {
  return (
    <div className="terminal-mock">
      <div className="term-bar">
        <span className="tdot tdot-r" />
        <span className="tdot tdot-y" />
        <span className="tdot tdot-g" />
        <span className="term-title">pipeline.py — FastAPI MLOps</span>
      </div>
      <div className="term-body">
        <div className="tl yellow">$ uvicorn pipeline:app --host 0.0.0.0</div>
        <div className="tl dim">INFO: Started server process [1]</div>
        <div className="tl dim">INFO: Application startup complete.</div>
        <div className="tl dim">INFO: Uvicorn running on port 8000</div>
        <div className="tl">&nbsp;</div>
        <div className="tl blue">POST /predict</div>
        <div className="tl dim">&nbsp;&nbsp;model: mlflow @champion alias</div>
        <div className="tl dim">&nbsp;&nbsp;features: 30 → fraud_score: 0.04</div>
        <div className="tl green">&nbsp;&nbsp;→ 200 OK (2-5ms)</div>
        <div className="tl">&nbsp;</div>
        <div className="tl yellow">MLflow registry</div>
        <div className="tl dim">&nbsp;&nbsp;PR-AUC, not ROC-AUC — see the case study</div>
        <div className="tl dim">&nbsp;&nbsp;Prometheus metrics scraped</div>
        <div className="tl green">
          &nbsp;&nbsp;Grafana alert rules: tested by simulate_incident.py
        </div>
        <div className="tl">&nbsp;</div>
        <div className="tl dim">
          GitHub Actions CI pipeline: <span style={{ color: "#5aad7a" }}>passed</span>
        </div>
        <div className="tl">
          <span className="term-cursor" />
        </div>
      </div>
    </div>
  );
}
