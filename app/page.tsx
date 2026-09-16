"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDown, ArrowUpRight, Asterisk, Code2, Mail, MousePointer2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Project = { id: string; index: string; title: string; category: string; year: string; description: string; stack: string[]; color: string };
const projects: Project[] = [
  { id:"orbit", index:"01", title:"Orbit Studio", category:"WebGL / Identity", year:"2026", description:"A spatial identity playground where sound, type and motion orbit one another in real time.", stack:["Three.js","GLSL","Web Audio"], color:"#b9a9ff" },
  { id:"moss", index:"02", title:"Moss Finance", category:"Product / Data", year:"2026", description:"A calm money workspace that turns dense financial patterns into clear, useful decisions.", stack:["React","TypeScript","D3"], color:"#a9e7be" },
  { id:"echo", index:"03", title:"Echo Garden", category:"WebGL / Audio", year:"2025", description:"A browser garden that grows a unique animated organism from every voice note.", stack:["WebGL","Audio API","Shaders"], color:"#ffacd0" },
  { id:"atlas", index:"04", title:"Atlas Notes", category:"Product / AI", year:"2025", description:"A collaborative knowledge tool built to make messy research feel beautifully navigable.", stack:["Next.js","Postgres","AI"], color:"#ffdc72" },
  { id:"gel", index:"05", title:"Softbody Type", category:"WebGL / Type", year:"2025", description:"An interactive type specimen that stretches, settles and responds like soft matter.", stack:["R3F","Rapier","WebGL"], color:"#8edee8" },
  { id:"signal", index:"06", title:"Signal / Noise", category:"Generative / Data", year:"2024", description:"A generative poster engine translating live city data into endlessly shifting compositions.", stack:["Canvas","WebSockets","Node"], color:"#ff9c87" },
];
const palette = ["#b9a9ff", ...projects.map((project) => project.color)];

function DeveloperCore({ activeIndex }: { activeIndex: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  useEffect(() => { activeRef.current = activeIndex }, [activeIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 0, 8.8);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const core = new THREE.Group();
    scene.add(core);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({ color:palette[0], roughness:.16, metalness:.02, transmission:.16, thickness:1.8, clearcoat:1, clearcoatRoughness:.08 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.45, 2.45, 1.18, 12, 12, 6), bodyMaterial);
    core.add(body);
    const frameMaterial = new THREE.MeshStandardMaterial({ color:0x2c2438, roughness:.3, metalness:.18 });
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), new THREE.LineBasicMaterial({ color:0x574a68, transparent:true, opacity:.8 }));
    core.add(frame);

    const ringMaterial = new THREE.MeshPhysicalMaterial({ color:0xfffaff, roughness:.12, clearcoat:1 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(.62,.11,24,80), ringMaterial);
    const ringB = ringA.clone();
    ringA.position.set(-.82,.12,.69); ringB.position.set(.82,.12,.69);
    core.add(ringA, ringB);
    const hubMaterial = new THREE.MeshStandardMaterial({ color:0x31273d, roughness:.28 });
    [ringA,ringB].forEach((ring) => { const hub = new THREE.Mesh(new THREE.IcosahedronGeometry(.25,1),hubMaterial); hub.position.copy(ring.position); core.add(hub) });

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.3,.34), new THREE.MeshBasicMaterial({ color:0x292333, transparent:true, opacity:.88 }));
    screen.position.set(0,-.72,.606); core.add(screen);
    for (let i=0;i<14;i+=1) {
      const tick = new THREE.Mesh(new THREE.PlaneGeometry(.085,.06), new THREE.MeshBasicMaterial({ color:i%3===0?0xffb2d2:0xece4ff }));
      tick.position.set(-.78+i*.12,-.72,.616); core.add(tick);
    }

    const orbit = new THREE.Group(); core.add(orbit);
    const smallGeometry = new THREE.SphereGeometry(.075,16,16);
    for (let i=0;i<30;i+=1) {
      const dot = new THREE.Mesh(smallGeometry,new THREE.MeshStandardMaterial({ color:new THREE.Color(palette[i%palette.length]), roughness:.24 }));
      const angle=i*.92, radius=2.15+(i%5)*.16;
      dot.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius*.68,(i%7)*.13-.4); orbit.add(dot);
    }
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.55,.012,8,180),new THREE.MeshBasicMaterial({ color:0x5d4c73,transparent:true,opacity:.5 }));
    halo.rotation.x=1.12; core.add(halo);

    scene.add(new THREE.HemisphereLight(0xffffff,0x9985d0,3.6));
    const key=new THREE.DirectionalLight(0xfff4dc,5.5); key.position.set(3,4,6); scene.add(key);
    const rim=new THREE.PointLight(0xff8fc1,34,12); rim.position.set(-4,-2,4); scene.add(rim);

    let px=0, py=0, pulse=0, frameId=0;
    const targetColor=new THREE.Color(palette[0]);
    const onMove=(event:PointerEvent)=>{ const rect=mount.getBoundingClientRect(); px=((event.clientX-rect.left)/rect.width-.5)*2; py=((event.clientY-rect.top)/rect.height-.5)*2 };
    const onDown=()=>{ pulse=1 };
    const resize=()=>{ const w=mount.clientWidth,h=mount.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/Math.max(h,1); camera.updateProjectionMatrix() };
    const timer=new THREE.Timer(); timer.connect(document);
    const animate=()=>{
      timer.update(); const t=timer.getElapsed(); const index=activeRef.current; const phase=index*.82;
      targetColor.set(palette[index%palette.length]); bodyMaterial.color.lerp(targetColor,.035);
      const targetX=(index%2===0?1:-1)*Math.min(index,1)*.72;
      core.position.x+=(targetX+px*.14-core.position.x)*.035;
      core.position.y+=(Math.sin(phase)*.22-py*.12-core.position.y)*.035;
      core.rotation.x+=((-.16+index*.08)-py*.1-core.rotation.x)*.03;
      core.rotation.y+=((index*.58)+px*.18-core.rotation.y)*.03;
      core.rotation.z+=((index%2?-.07:.07)-core.rotation.z)*.03;
      const scale=1+pulse*.11; core.scale.lerp(new THREE.Vector3(scale,scale,scale),.18); pulse*=.84;
      if(!reduced){ ringA.rotation.z=t*.7+phase; ringB.rotation.z=-t*.62-phase; orbit.rotation.z=t*.055+phase*.2; halo.rotation.z=t*.08 }
      renderer.render(scene,camera); frameId=requestAnimationFrame(animate);
    };
    resize(); animate(); mount.addEventListener("pointermove",onMove); mount.addEventListener("pointerdown",onDown); window.addEventListener("resize",resize);
    return()=>{ cancelAnimationFrame(frameId); timer.dispose(); mount.removeEventListener("pointermove",onMove); mount.removeEventListener("pointerdown",onDown); window.removeEventListener("resize",resize); scene.traverse((node)=>{ if(node instanceof THREE.Mesh){ node.geometry.dispose(); if(node.material instanceof THREE.Material)node.material.dispose() } }); renderer.dispose(); renderer.domElement.remove() };
  },[]);
  return <div ref={mountRef} className="core-canvas" aria-label="Interactive 3D developer core. Move or click to interact." role="img" />;
}

export default function Home(){
  const [activeIndex,setActiveIndex]=useState(0);
  const [selectedProject,setSelectedProject]=useState<Project|null>(null);
  const [booting,setBooting]=useState(true);
  useEffect(()=>{ const timer=window.setTimeout(()=>setBooting(false),1700); return()=>window.clearTimeout(timer) },[]);
  useEffect(()=>{
    const observer=new IntersectionObserver((entries)=>entries.forEach((entry)=>{ if(entry.isIntersecting){ const index=Number((entry.target as HTMLElement).dataset.index); setActiveIndex(index) } }),{ threshold:.58 });
    document.querySelectorAll(".story-chapter").forEach((chapter)=>observer.observe(chapter));
    const update=()=>document.documentElement.style.setProperty("--scroll",String(window.scrollY/Math.max(document.documentElement.scrollHeight-window.innerHeight,1)));
    update(); window.addEventListener("scroll",update,{passive:true});
    return()=>{ observer.disconnect(); window.removeEventListener("scroll",update) };
  },[]);
  return <main>
    <div className={`boot-screen ${booting?"is-booting":"is-ready"}`} aria-hidden={!booting}><div className="boot-top"><span>SRN / SYSTEM</span><span>PORTFOLIO.OS</span></div><div className="boot-center"><Asterisk/><p>Loading playful systems</p><div className="boot-track"><i/></div></div><div className="boot-bottom"><span>Creative developer</span><span>2026</span></div></div>
    <div className="page-progress" aria-hidden="true" />
    <nav className="nav-shell"><a className="wordmark" href="#top">SRN<span/></a><div><a href="#work">Projects</a><a href="#about">About</a></div><a className="nav-mail" href="mailto:hello@example.com">Let&apos;s talk <ArrowUpRight size={16}/></a></nav>
    <section className="experience" id="top">
      <div className="experience-stage"><DeveloperCore activeIndex={activeIndex}/><div className="stage-grid"/><p className="interaction-note"><MousePointer2 size={15}/> Move + click the object</p><div className="chapter-counter"><span>{String(activeIndex).padStart(2,"0")}</span><i/><span>06</span></div></div>
      <div className="story-layer">
        <article className={`story-chapter hero-chapter ${activeIndex===0?"is-active":""}`} data-index="0"><div className="chapter-copy"><p className="kicker"><Asterisk size={15}/> Creative developer · Kuala Lumpur</p><h1>Digital things<br/>with a <em>pulse.</em></h1><p>I build expressive WebGL worlds, playful interfaces and products that reward curiosity.</p><a href="#work" className="scroll-link"><ArrowDown size={17}/> Scroll to enter</a></div></article>
        <div id="work">
          {projects.map((project,index)=><article className={`story-chapter project-chapter ${index%2?"align-right":"align-left"} ${activeIndex===index+1?"is-active":""}`} data-index={index+1} key={project.id} style={{"--chapter-color":project.color} as React.CSSProperties}><div className="chapter-wash"/><div className="project-copy"><p className="project-label"><span>{project.index}</span>{project.category}</p><h2>{project.title}</h2><p>{project.description}</p><div className="project-stack">{project.stack.map((item)=><span key={item}>{item}</span>)}</div><button onClick={()=>setSelectedProject(project)}>Open project <ArrowUpRight size={18}/></button><span className="project-year">© {project.year}</span></div></article>)}
        </div>
      </div>
    </section>
    <section className="about-section" id="about"><p className="kicker"><Asterisk size={15}/> About the maker</p><div><h2>Engineer&apos;s brain.<br/><em>Artist&apos;s instinct.</em></h2><aside><p>I translate ambitious ideas into fast, memorable experiences—balancing technical precision with a little visual mischief.</p><ul><li>Creative development</li><li>Frontend architecture</li><li>WebGL & shaders</li><li>Product design</li></ul></aside></div></section>
    <footer><p>Have a strange idea?</p><a href="mailto:hello@example.com">Make it real <ArrowUpRight/></a><div><span>© 2026 Your Name</span><span><a href="#"><Code2 size={16}/> GitHub</a><a href="mailto:hello@example.com"><Mail size={16}/> Email</a></span></div></footer>
    <Dialog open={Boolean(selectedProject)} onOpenChange={(open)=>!open&&setSelectedProject(null)}><DialogContent className="project-dialog" style={{"--chapter-color":selectedProject?.color} as React.CSSProperties}>{selectedProject&&<><DialogHeader><DialogDescription>{selectedProject.index} / {selectedProject.category} · {selectedProject.year}</DialogDescription><DialogTitle>{selectedProject.title}</DialogTitle></DialogHeader><div className="dialog-visual"><i/><i/><i/><b>{selectedProject.index}</b></div><p>{selectedProject.description}</p><div className="dialog-stack">{selectedProject.stack.map((item)=><span key={item}>{item}</span>)}</div><a href="#">View full case study <ArrowUpRight size={18}/></a></>}</DialogContent></Dialog>
  </main>
}
