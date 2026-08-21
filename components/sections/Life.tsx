import { Reveal } from "@/components/Reveal";
import { getLife } from "@/lib/data";

export function Life() {
  const { quote, bento, journal } = getLife();
  return (
    <section className="wrap-sm" id="life">
      <Reveal>
        <span className="section-label copper">Beyond the Code</span>
      </Reveal>
      <Reveal>
        <h2 className="mixed-heading" style={{ marginBottom: "2.5rem" }}>
          <span className="dim">Not just</span>
          <br />
          an engineer.
        </h2>
      </Reveal>
      <Reveal>
        <p className="life-quote">&ldquo;{quote}&rdquo;</p>
      </Reveal>
      <Reveal className="life-bento">
        {bento.map((card) => (
          <div key={card.id} className={`lb lb-${card.size} lb-${card.palette}`}>
            <div className="lb-glow" />
            <div className="lb-icon">{card.icon}</div>
            <div className="lb-title">{card.title}</div>
            <div className="lb-desc">{card.desc}</div>
          </div>
        ))}
      </Reveal>

      <Reveal>
        <span className="section-label copper" style={{ marginBottom: ".5rem" }}>
          {journal.label}
        </span>
        <div className="m-sub">{journal.sub}</div>
        <div className="mgrid">
          {journal.items.map((item, i) => (
            <div key={item} className="mo">
              <span className="mo-n">{String(i + 1).padStart(2, "0")}</span>
              {item}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
