import { Nav } from "@/components/Nav";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HeroCard } from "@/components/sections/HeroCard";
import { Life } from "@/components/sections/Life";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Writing } from "@/components/sections/Writing";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="content">
        <Hero />
        <HeroCard />
        <Skills />
        <About />
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
