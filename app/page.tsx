import { Nav } from "@/components/Nav";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HeroCard } from "@/components/sections/HeroCard";
import { Life } from "@/components/sections/Life";
import { Projects } from "@/components/sections/Projects";
import { ShelfSection } from "@/components/sections/ShelfSection";
import { Skills } from "@/components/sections/Skills";
import { Writing } from "@/components/sections/Writing";
import { getProjects, getWriting } from "@/lib/data";
import { jsonLdBlocks } from "@/lib/jsonld";

export default function Home() {
  const blocks = jsonLdBlocks(getProjects(), getWriting());
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <Nav />
      <div className="content">
        <Hero />
        <HeroCard />
        <Skills />
        <About />
        <ShelfSection />
        <Projects />
        <Writing />
        <Experience />
        <Life />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
