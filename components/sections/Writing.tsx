import { Reveal } from "@/components/Reveal";
import { getWriting } from "@/lib/data";

export function Writing() {
  const { publications, posts } = getWriting();
  return (
    <section className="wrap-sm" id="writing">
      <Reveal>
        <span className="section-label">Writing</span>
      </Reveal>
      <Reveal>
        <h2 className="mixed-heading" style={{ marginBottom: "1rem" }}>
          <span className="dim">The parts</span>
          <br />
          that went wrong.
        </h2>
      </Reveal>
      <Reveal>
        <p className="section-lede">
          Build logs and postmortems. Those are the parts worth reading.
        </p>
      </Reveal>

      <Reveal className="writing-wrap">
        {publications.map((pub) => (
          <p key={pub.url} className="writing-pub">
            <a href={pub.url} target="_blank" rel="noopener">
              {pub.name}
            </a>{" "}
            <span className="writing-platform">on {pub.platform}</span>
            <br />
            <span className="writing-desc">{pub.description}</span>
          </p>
        ))}
        <ul className="writing-list">
          {posts.map((post) => (
            <li key={post.url} className="writing-item">
              <time dateTime={post.date}>{post.date}</time>
              <a href={post.url} target="_blank" rel="noopener">
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
