"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDownRight, ArrowUpRight, Asterisk, Code2, Mail, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Project = { id: string; index: string; title: string; category: "WebGL" | "Product" | "Experiments"; year: string; description: string; stack: string[]; color: string };

const projects: Project[] = [
  { id: "orbit", index: "01", title: "Orbit Studio", category: "WebGL", year: "2026", description: "A spatial identity playground where sound, type and motion orbit one another in real time.", stack: ["Three.js", "GLSL", "Web Audio"], color: "#b9a9ff" },
  { id: "moss", index: "02", title: "Moss Finance", category: "Product", year: "2026", description: "A calm money workspace that turns dense financial patterns into clear, useful decisions.", stack: ["React", "TypeScript", "D3"], color: "#b8e6c7" },
  { id: "echo", index: "03", title: "Echo Garden", category: "Experiments", year: "2025", description: "A browser garden that grows a unique animated organism from every voice note.", stack: ["WebGL", "Audio API", "Shaders"], color: "#ffc2dc" },
  { id: "atlas", index: "04", title: "Atlas Notes", category: "Product", year: "2025", description: "A collaborative knowledge tool built to make messy research feel beautifully navigable.", stack: ["Next.js", "Postgres", "AI"], color: "#ffe08d" },
  { id: "gel", index: "05", title: "Softbody Type", category: "WebGL", year: "2025", description: "An interactive type specimen that stretches, settles and responds like soft matter.", stack: ["R3F", "Rapier", "WebGL"], color: "#9cdce3" },
  { id: "signal", index: "06", title: "Signal / Noise", category: "Experiments", year: "2024", description: "A generative poster engine translating live city data into endlessly shifting compositions.", stack: ["Canvas", "WebSockets", "Node"], color: "#ffae9d" },
];
const filters = ["All", "WebGL", "Product", "Experiments"] as const;

function WebGLWorld() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    const colors = [0xb9a9ff, 0xffc2dc, 0xb8e6c7, 0xffe08d, 0x9cdce3];
    const geometries = [new THREE.TorusKnotGeometry(1.25, 0.38, 160, 24), new THREE.IcosahedronGeometry(0.72, 2), new THREE.TorusGeometry(0.64, 0.19, 24, 80)];
    const objects: THREE.Mesh[] = [];
    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshPhysicalMaterial({ color: colors[index], roughness: 0.18, transmission: index === 0 ? 0.13 : 0.02, thickness: 1.2, clearcoat: 1, clearcoatRoughness: 0.2 });
      const mesh = new THREE.Mesh(geometry, material);
      if (index === 1) mesh.position.set(-2.2, 1.35, -0.5);
      if (index === 2) mesh.position.set(2.15, -1.35, 0.2);
      mesh.rotation.set(index * 0.7, index * 0.4, index * 0.2);
      group.add(mesh); objects.push(mesh);
    });
    const dotGeometry = new THREE.SphereGeometry(0.075, 14, 14);
    for (let index = 0; index < 26; index += 1) {
      const dot = new THREE.Mesh(dotGeometry, new THREE.MeshStandardMaterial({ color: colors[index % colors.length], roughness: 0.25 }));
      const angle = index * 2.399; const radius = 2.4 + (index % 4) * 0.33;
      dot.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7, (index % 5) * 0.26 - 0.7); group.add(dot);
    }
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8c8ff, 3.1));
    const key = new THREE.DirectionalLight(0xfff5eb, 5.5); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.PointLight(0xffa8d0, 28, 10); rim.position.set(-3, -2, 4); scene.add(rim);
    let pointerX = 0, pointerY = 0, scrollProgress = 0, frame = 0;
    const onPointerMove = (event: PointerEvent) => { const rect = mount.getBoundingClientRect(); pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2; pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2 };
    const onScroll = () => { scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.6) };
    const resize = () => { const width = mount.clientWidth, height = mount.clientHeight; renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix() };
    const clock = new THREE.Clock();
    const animate = () => { const t = clock.getElapsedTime(); group.rotation.y += (pointerX * 0.28 + scrollProgress * 1.3 - group.rotation.y) * 0.025; group.rotation.x += (-pointerY * 0.18 + scrollProgress * .22 - group.rotation.x) * 0.025; group.position.y += (-scrollProgress * .55 - group.position.y) * .03; if (!reduced) { objects[0].rotation.z = t * 0.14 + scrollProgress * .9; objects[0].rotation.y = t * 0.1; objects[1].position.y = 1.35 + Math.sin(t * 0.8) * 0.18; objects[2].rotation.x = t * -0.28 - scrollProgress } renderer.render(scene, camera); frame = requestAnimationFrame(animate) };
    resize(); onScroll(); animate(); mount.addEventListener("pointermove", onPointerMove); window.addEventListener("resize", resize); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); mount.removeEventListener("pointermove", onPointerMove); window.removeEventListener("resize", resize); window.removeEventListener("scroll", onScroll); geometries.forEach((g) => g.dispose()); dotGeometry.dispose(); scene.traverse((child) => { if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) child.material.dispose() }); renderer.dispose(); renderer.domElement.remove() };
  }, []);
  return <div ref={mountRef} className="webgl-world" aria-hidden="true" />;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const visibleProjects = useMemo(() => projects.filter((project) => activeFilter === "All" || project.category === activeFilter), [activeFilter]);
  const moveProject = (event: React.PointerEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    card.style.setProperty("--shift-x", `${(x - 0.5) * 28}px`);
    card.style.setProperty("--shift-y", `${(y - 0.5) * 22}px`);
  };
  const leaveProject = (event: React.PointerEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--shift-x", "0px");
    card.style.setProperty("--shift-y", "0px");
  };
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible") }), { threshold: 0.14 });
    document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
    const updateScroll = () => document.documentElement.style.setProperty("--scroll-progress", String(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)));
    updateScroll(); window.addEventListener("scroll", updateScroll, { passive: true });
    return () => { revealObserver.disconnect(); window.removeEventListener("scroll", updateScroll) };
  }, [visibleProjects]);
  return <main>
    <div className="scroll-progress" aria-hidden="true" />
    <nav className="nav-shell" aria-label="Main navigation"><a className="wordmark" href="#top" aria-label="Home"><span>SRN</span><i /></a><div className="nav-links"><a href="#work">Work <sup>06</sup></a><a href="#about">About</a></div><a className="available" href="mailto:hello@example.com"><span /> Available for work</a></nav>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow"><Asterisk size={16} /> Creative developer · Kuala Lumpur</p><h1>I make digital<br />things that feel<br /><em>almost alive.</em></h1><p className="intro">I design and develop playful interfaces, WebGL worlds and thoughtful digital products.</p></div><div className="hero-world"><WebGLWorld /><p className="drag-note">Move your cursor <span>↗</span></p></div><a href="#work" className="scroll-cue"><ArrowDownRight size={18} /> Explore the work</a></section>
    <section className="work-section" id="work"><div className="section-heading" data-reveal><p className="eyebrow"><Sparkles size={15} /> Selected work</p><h2>Ideas, shipped.</h2><p>A growing archive of experiments, products and beautifully odd things for the web.</p></div><div className="filter-row" aria-label="Filter projects" data-reveal>{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="project-list">{visibleProjects.map((project, index) => <div className="project-reveal" data-reveal key={project.id} style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}><button className="project-card" onPointerMove={moveProject} onPointerLeave={leaveProject} onClick={() => setSelectedProject(project)} style={{ "--project-color": project.color } as React.CSSProperties}><span className="project-glow" /><span className="project-visual" aria-hidden="true"><i /><i /><i /><b>{project.index}</b></span><span className="project-content"><span className="project-topline"><span>{project.category}</span><span>{project.year}</span></span><span className="project-title">{project.title}</span><span className="project-description">{project.description}</span><span className="project-stack">{project.stack.map((item) => <em key={item}>{item}</em>)}</span></span><span className="project-cta">Explore <ArrowUpRight size={20} /></span></button></div>)}</div></section>
    <section className="about-section" id="about"><p className="eyebrow" data-reveal><Asterisk size={15} /> About</p><div className="about-grid" data-reveal><h2>Part engineer,<br />part daydreamer.</h2><div><p>I turn ambitious ideas into expressive, performant experiences. My sweet spot is where precise engineering meets a little visual mischief.</p><div className="skills"><span>Creative direction</span><span>Frontend systems</span><span>WebGL / shaders</span><span>Product design</span></div></div></div></section>
    <footer><p>Have a strange idea?</p><a href="mailto:hello@example.com">Let’s make it real <ArrowUpRight /></a><div><span>© 2026 Your Name</span><span><a href="#"><Code2 size={16} /> GitHub</a><a href="mailto:hello@example.com"><Mail size={16} /> Email</a></span></div></footer>
    <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => !open && setSelectedProject(null)}><DialogContent className="project-dialog" style={{ "--project-color": selectedProject?.color } as React.CSSProperties}>{selectedProject && <><DialogHeader><DialogDescription>{selectedProject.index} / {selectedProject.category} · {selectedProject.year}</DialogDescription><DialogTitle>{selectedProject.title}</DialogTitle></DialogHeader><div className="dialog-art"><span /><span /><span /></div><p className="dialog-copy">{selectedProject.description}</p><div className="dialog-stack">{selectedProject.stack.map((item) => <span key={item}>{item}</span>)}</div><a className="case-link" href="#">View case study <ArrowUpRight size={18} /></a></>}</DialogContent></Dialog>
  </main>;
}
