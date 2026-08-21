import { Reveal } from "@/components/Reveal";
import { Terminal } from "./Terminal";

export function About() {
  return (
    <div className="split-section" id="about">
      <Reveal className="split-text">
        <span className="section-label copper">Background</span>
        <h2 className="mixed-heading">
          <span className="dim">Engineer.</span>
          <br />
          Explorer.
          <br />
          <span className="dim">Builder.</span>
        </h2>
        <p>
          Originally from India, now building my world from Montréal. Finished
          my Master&apos;s in Applied Computer Science at Concordia in May 2026
          and moved into backend and MLOps engineering. I deploy ML systems,
          architect distributed backends, and chase certs. The code is one part
          of a much bigger story.
        </p>
        <div className="sbullets">
          <div className="sbullet">
            <span className="sbullet-icon">⚡</span>
            <div>
              <strong>Cloud-native from day one</strong>
              <p>GCP, AWS, Docker, CI/CD — infrastructure as a first-class concern.</p>
            </div>
          </div>
          <div className="sbullet">
            <span className="sbullet-icon">🧠</span>
            <div>
              <strong>MLOps end-to-end</strong>
              <p>From model training to production observability — Prometheus, Grafana, MLflow.</p>
            </div>
          </div>
          <div className="sbullet">
            <span className="sbullet-icon">🌍</span>
            <div>
              <strong>Montréal, QC · Available now</strong>
              <p>Open to MLOps, Cloud, or Backend Engineering roles in Montréal.</p>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal className="split-mock" delay={2}>
        <Terminal />
      </Reveal>
    </div>
  );
}
