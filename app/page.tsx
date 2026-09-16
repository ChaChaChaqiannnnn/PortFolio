"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDown, ArrowUpRight, Asterisk, Code2, MousePointer2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Project = { id: string; index: string; title: string; category: string; year: string; description: string; stack: string[]; color: string; github: string; live?: string };
const projects: Project[] = [
  { id:"cogniplan", index:"01", title:"CogniPlan", category:"Product / Learning", year:"2026", description:"An intelligent, mobile-first study planner using spaced repetition, cognitive-load signals and role-based dashboards to help students learn with intention.", stack:["React Native","TypeScript","Firebase","FSRS"], color:"#c4a8ff", github:"https://github.com/ChaChaChaqiannnnn/CogniPlan-main", live:"https://cogniplan-f615f.web.app" },
  { id:"svv", index:"02", title:"Web Verification Lab", category:"Automation / Quality", year:"2026", description:"A three-layer testing and performance suite that verifies live web experiences, captures visual evidence and monitors availability over time.", stack:["Python","Selenium","BeautifulSoup","Chrome"], color:"#84e5d0", github:"https://github.com/ChaChaChaqiannnnn/SVV" },
  { id:"algo", index:"03", title:"Algorithm Atelier", category:"Algorithms / Research", year:"2025", description:"An analytical implementation of merge sort, quick sort and binary search across large generated datasets, comparing time and space behavior.", stack:["Java","Python","Algorithms","Data"], color:"#ffca6e", github:"https://github.com/ChaChaChaqiannnnn/Algo" },
  { id:"shopease", index:"04", title:"ShopEase System", category:"Software / Architecture", year:"2025", description:"A Java software-design study organized around a ShopEase domain, exploring maintainable structure, object modeling and implementation discipline.", stack:["Java","OOP","Architecture"], color:"#ff91bd", github:"https://github.com/ChaChaChaqiannnnn/SD_ass" },
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
    const bodyMaterial = new THREE.MeshPhysicalMaterial({ color:palette[0], roughness:.12, metalness:.02, transmission:.2, thickness:1.8, clearcoat:1, clearcoatRoughness:.06 });
    const body = new THREE.Mesh(new THREE.TorusKnotGeometry(1.08,.34,190,28,2,3), bodyMaterial);
    core.add(body);
    const petals:THREE.Mesh[]=[];
    const petalGeometry=new THREE.IcosahedronGeometry(.68,2);
    for(let i=0;i<6;i+=1){
      const material=new THREE.MeshPhysicalMaterial({color:new THREE.Color(palette[(i+1)%palette.length]),roughness:.18,transmission:.12,thickness:1,clearcoat:1});
      const petal=new THREE.Mesh(petalGeometry,material); const angle=(i/6)*Math.PI*2;
      petal.position.set(Math.cos(angle)*1.62,Math.sin(angle)*1.62,.08*Math.sin(i)); petal.scale.set(1.25,.56,.42); petal.rotation.z=angle;
      petals.push(petal); core.add(petal);
    }
    const ringMaterial = new THREE.MeshPhysicalMaterial({ color:0xfffaff, roughness:.12, clearcoat:1 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.2,.035,12,110), ringMaterial);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.65,.018,10,130), ringMaterial);
    ringA.rotation.x=1.05; ringB.rotation.y=1.2; core.add(ringA,ringB);

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
      if(!reduced){ body.rotation.x=t*.14; body.rotation.y=t*.18+phase; ringA.rotation.z=t*.16+phase; ringB.rotation.z=-t*.1-phase; orbit.rotation.z=t*.055+phase*.2; halo.rotation.z=t*.08; petals.forEach((petal,i)=>{petal.rotation.x=t*.22+i*.4;petal.rotation.y=-t*.16+i*.3}) }
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
    <div className={`boot-screen ${booting?"is-booting":"is-ready"}`} aria-hidden={!booting}><div className="boot-top"><span>CQ / STUDIO</span><span>PORTFOLIO.OS</span></div><div className="boot-center"><Asterisk/><p>Warming up the imagination</p><div className="boot-track"><i/></div></div><div className="boot-bottom"><span>Creative technologist</span><span>2026</span></div></div>
    <div className="page-progress" aria-hidden="true" />
    <nav className="nav-shell"><a className="wordmark" href="#top">CQ<span/></a><div><a href="#work">Projects</a><a href="#about">About</a><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer">GitHub</a></div><a className="nav-mail" href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer">Follow the code <ArrowUpRight size={16}/></a></nav>
    <section className="experience" id="top">
      <div className="experience-stage"><DeveloperCore activeIndex={activeIndex}/><div className="stage-grid"/><p className="interaction-note"><MousePointer2 size={15}/> Move + click the sculpture</p><div className="chapter-counter"><span>{String(activeIndex).padStart(2,"0")}</span><i/><span>04</span></div></div>
      <div className="story-layer">
        <article className={`story-chapter hero-chapter ${activeIndex===0?"is-active":""}`} data-index="0"><div className="chapter-copy"><p className="kicker"><Asterisk size={15}/> Hong Chia Qian · Creative technologist</p><h1>Code, colour<br/>&amp; <em>curiosity.</em></h1><p>I&apos;m a Multimedia University developer who enjoys making rigorous software feel expressive—moving between learning technology, automation, algorithms and playful interactive experiments.</p><div className="hero-actions"><a href="#work" className="scroll-link"><ArrowDown size={17}/> Enter the work</a><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer" className="github-pill"><Code2 size={17}/> @Chachachaqiannnnn</a></div></div></article>
        <div id="work">
          {projects.map((project,index)=><article className={`story-chapter project-chapter ${index%2?"align-right":"align-left"} ${activeIndex===index+1?"is-active":""}`} data-index={index+1} key={project.id} style={{"--chapter-color":project.color} as React.CSSProperties}><div className="chapter-wash"/><div className="project-copy"><p className="project-label"><span>{project.index}</span>{project.category}</p><h2>{project.title}</h2><p>{project.description}</p><div className="project-stack">{project.stack.map((item)=><span key={item}>{item}</span>)}</div><div className="project-actions"><button onClick={()=>setSelectedProject(project)}>View story <ArrowUpRight size={18}/></button><a href={project.github} target="_blank" rel="noreferrer"><Code2 size={17}/> Source</a>{project.live&&<a href={project.live} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={17}/></a>}</div><span className="project-year">© {project.year}</span></div></article>)}
        </div>
      </div>
    </section>
    <section className="about-section" id="about"><p className="kicker"><Asterisk size={15}/> A little more personal</p><div><h2>I learn by<br/><em>making things.</em></h2><aside><img src="https://github.com/Chachachaqiannnnn.png?size=320" alt="Hong Chia Qian"/><p>I&apos;m Hong Chia Qian, a Multimedia University student and builder. I like projects with a real purpose, but I never want usefulness to erase personality. My work pairs careful engineering with colour, motion and a sense of play.</p><p className="personal-note">Right now, that means building CogniPlan as my final-year project, exploring evidence-based study scheduling, and sharpening my craft through automation, algorithms and software verification.</p><div className="about-facts"><span><b>Current focus</b>Learning technology</span><span><b>Languages</b>TypeScript · Python · Java</span><span><b>I care about</b>Clarity · Quality · Feeling</span><span><b>My approach</b>Build · Test · Refine</span></div><a className="profile-link" href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer"><Code2 size={18}/> Explore all GitHub work <ArrowUpRight size={18}/></a></aside></div></section>
    <footer><p>Have a strange idea?</p><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer">Let&apos;s create <ArrowUpRight/></a><div><span>© 2026 Chia Qian</span><span><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer"><Code2 size={16}/> GitHub</a><a href="https://cogniplan-f615f.web.app" target="_blank" rel="noreferrer"><ArrowUpRight size={16}/> CogniPlan</a></span></div></footer>
    <Dialog open={Boolean(selectedProject)} onOpenChange={(open)=>!open&&setSelectedProject(null)}><DialogContent className="project-dialog" style={{"--chapter-color":selectedProject?.color} as React.CSSProperties}>{selectedProject&&<><DialogHeader><DialogDescription>{selectedProject.index} / {selectedProject.category} · {selectedProject.year}</DialogDescription><DialogTitle>{selectedProject.title}</DialogTitle></DialogHeader><div className="dialog-visual"><i/><i/><i/><b>{selectedProject.index}</b></div><p>{selectedProject.description}</p><div className="dialog-stack">{selectedProject.stack.map((item)=><span key={item}>{item}</span>)}</div><div className="dialog-actions"><a href={selectedProject.github} target="_blank" rel="noreferrer"><Code2 size={18}/> GitHub source</a>{selectedProject.live&&<a href={selectedProject.live} target="_blank" rel="noreferrer">Open live app <ArrowUpRight size={18}/></a>}</div></>}</DialogContent></Dialog>
  </main>
}
