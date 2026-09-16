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
  const scrollRef = useRef(0);
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

    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(270 * 3);
    for (let i=0;i<270;i+=1) {
      const seed = Math.sin(i * 9283.17) * 43758.5453;
      const seed2 = Math.sin(i * 3137.91) * 12741.881;
      dustPositions[i*3] = (seed - Math.floor(seed) - .5) * 18;
      dustPositions[i*3+1] = (seed2 - Math.floor(seed2) - .5) * 12;
      dustPositions[i*3+2] = -2 - (i%17) * .55;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions,3));
    const dustMaterial = new THREE.PointsMaterial({ color:0xffe6f3,size:.026,transparent:true,opacity:.65,sizeAttenuation:true });
    const dust = new THREE.Points(dustGeometry,dustMaterial); scene.add(dust);

    scene.add(new THREE.HemisphereLight(0xffffff,0x9985d0,3.6));
    const key=new THREE.DirectionalLight(0xfff4dc,5.5); key.position.set(3,4,6); scene.add(key);
    const rim=new THREE.PointLight(0xff8fc1,34,12); rim.position.set(-4,-2,4); scene.add(rim);

    let px=0, py=0, pulse=0, frameId=0;
    const targetColor=new THREE.Color(palette[0]);
    const targetScale=new THREE.Vector3(1,1,1);
    const onMove=(event:PointerEvent)=>{ const rect=mount.getBoundingClientRect(); px=((event.clientX-rect.left)/rect.width-.5)*2; py=((event.clientY-rect.top)/rect.height-.5)*2 };
    const onDown=()=>{ pulse=1 };
    const onScroll=()=>{ scrollRef.current=window.scrollY/Math.max(window.innerHeight,1) };
    const resize=()=>{ const w=mount.clientWidth,h=mount.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/Math.max(h,1); camera.updateProjectionMatrix() };
    const timer=new THREE.Timer(); timer.connect(document);
    const animate=()=>{
      timer.update(); const t=timer.getElapsed(); const index=activeRef.current; const scroll=scrollRef.current; const phase=scroll*.82;
      targetColor.set(palette[index%palette.length]); bodyMaterial.color.lerp(targetColor,.035);
      const targetX=index===0?0:(index%2===0?.78:-.78);
      core.position.x+=(targetX+px*.18-core.position.x)*.035;
      core.position.y+=(Math.sin(phase)*.28-py*.15-core.position.y)*.035;
      core.rotation.x+=((-.18+scroll*.075)-py*.12-core.rotation.x)*.03;
      core.rotation.y+=((scroll*.62)+px*.2-core.rotation.y)*.03;
      core.rotation.z+=(Math.sin(scroll*Math.PI)*.13-core.rotation.z)*.03;
      const scale=1+pulse*.14+Math.sin(scroll*Math.PI)*.035; targetScale.setScalar(scale); core.scale.lerp(targetScale,.18); pulse*=.84;
      camera.position.z+=(8.8+Math.sin(scroll*Math.PI*.5)*.48-camera.position.z)*.035;
      if(!reduced){
        body.rotation.x=t*.14+scroll*.08; body.rotation.y=t*.18+phase;
        ringA.rotation.z=t*.16+phase; ringB.rotation.z=-t*.1-phase; orbit.rotation.z=t*.055+phase*.2; halo.rotation.z=t*.08;
        dust.rotation.z=t*.006; dust.position.y=-(scroll%1)*.25;
        petals.forEach((petal,i)=>{ const angle=(i/6)*Math.PI*2+scroll*.28; const radius=1.62+Math.sin(scroll*Math.PI+i*.8)*.3; petal.position.x+=(Math.cos(angle)*radius-petal.position.x)*.045; petal.position.y+=(Math.sin(angle)*radius-petal.position.y)*.045; petal.position.z+=(Math.sin(scroll*.9+i)*.48-petal.position.z)*.045; petal.rotation.x=t*.22+i*.4;petal.rotation.y=-t*.16+i*.3 });
      }
      renderer.render(scene,camera); frameId=requestAnimationFrame(animate);
    };
    resize(); onScroll(); animate(); mount.addEventListener("pointermove",onMove); mount.addEventListener("pointerdown",onDown); window.addEventListener("resize",resize); window.addEventListener("scroll",onScroll,{passive:true});
    return()=>{ cancelAnimationFrame(frameId); timer.dispose(); mount.removeEventListener("pointermove",onMove); mount.removeEventListener("pointerdown",onDown); window.removeEventListener("resize",resize); window.removeEventListener("scroll",onScroll); scene.traverse((node)=>{ if(node instanceof THREE.Mesh){ node.geometry.dispose(); if(node.material instanceof THREE.Material)node.material.dispose() } }); dustGeometry.dispose(); dustMaterial.dispose(); renderer.dispose(); renderer.domElement.remove() };
  },[]);
  return <div ref={mountRef} className="core-canvas" aria-label="Interactive 3D developer core. Move or click to interact." role="img" />;
}

function CinematicCursor(){
  const cursorRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!window.matchMedia("(pointer:fine)").matches)return;
    const cursor=cursorRef.current;if(!cursor)return;
    const move=(event:PointerEvent)=>{cursor.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`};
    const over=(event:PointerEvent)=>{cursor.classList.toggle("is-hovering",Boolean((event.target as Element)?.closest("a,button")))};
    window.addEventListener("pointermove",move);window.addEventListener("pointerover",over);
    return()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerover",over)};
  },[]);
  return <div ref={cursorRef} className="cinematic-cursor" aria-hidden="true"><i/></div>;
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
    <CinematicCursor/>
    <div className={`boot-screen ${booting?"is-booting":"is-ready"}`} aria-hidden={!booting}><div className="boot-top"><span>CQ / A living portfolio</span><span>Film 001 · 2026</span></div><div className="boot-center"><span className="boot-mark">CQ</span><p>Make logic feel alive.</p><div className="boot-track"><i/></div></div><div className="boot-bottom"><span>Creative technologist</span><span>Scroll to direct</span></div></div>
    <div className="page-progress" aria-hidden="true" />
    <nav className="nav-shell"><a className="wordmark" href="#top">CQ<span/></a><div><a href="#work">Projects</a><a href="#about">About</a><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer">GitHub</a></div><a className="nav-mail" href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer">Follow the code <ArrowUpRight size={16}/></a></nav>
    <section className="experience" id="top">
      <div className="experience-stage"><DeveloperCore activeIndex={activeIndex}/><div className="stage-grid"/><div className="film-grain"/><p className="interaction-note"><MousePointer2 size={15}/> Move · click · direct</p><div className="chapter-counter"><span>{String(activeIndex).padStart(2,"0")}</span><i/><span>04</span></div><div className="scene-name">{activeIndex===0?"Opening sequence":projects[activeIndex-1]?.category}</div><div className="scene-rail" aria-label="Portfolio chapters"><a href="#top" className={activeIndex===0?"is-current":""}><span>00</span><i/></a>{projects.map((project,index)=><a href={`#${project.id}`} className={activeIndex===index+1?"is-current":""} key={project.id}><span>{project.index}</span><i/></a>)}</div></div>
      <div className="story-layer">
        <article className={`story-chapter hero-chapter ${activeIndex===0?"is-active":""}`} data-index="0"><div className="chapter-copy"><p className="kicker"><Asterisk size={15}/> Hong Chia Qian · Creative technologist</p><p className="scene-eyebrow">A digital atelier for useful, curious things</p><h1><span>Code, colour</span><br/><em>&amp; curiosity.</em></h1><p>I&apos;m a Multimedia University developer turning serious systems into expressive digital experiences—across learning technology, automation, algorithms and playful experiments.</p><div className="hero-actions"><a href="#work" className="scroll-link"><ArrowDown size={17}/> Direct the story</a><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer" className="github-pill"><Code2 size={17}/> @Chachachaqiannnnn</a></div></div><p className="hero-aside">One world<br/>Four chapters<br/>Made by CQ</p></article>
        <div id="work">
          {projects.map((project,index)=><article id={project.id} className={`story-chapter project-chapter ${index%2?"align-right":"align-left"} ${activeIndex===index+1?"is-active":""}`} data-index={index+1} key={project.id} style={{"--chapter-color":project.color} as React.CSSProperties}><div className="chapter-wash"><span className="poster-index">{project.index}</span><div className="wash-orbit"/></div><div className="project-copy"><p className="project-label"><span>{project.index}</span>{project.category}</p><h2><span>{project.title}</span></h2><p>{project.description}</p><div className="project-stack">{project.stack.map((item)=><span key={item}>{item}</span>)}</div><div className="project-actions"><button onClick={()=>setSelectedProject(project)}>Open case file <ArrowUpRight size={18}/></button><a href={project.github} target="_blank" rel="noreferrer"><Code2 size={17}/> Source</a>{project.live&&<a href={project.live} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={17}/></a>}</div><span className="project-year">Chapter {project.index} · © {project.year}</span></div><p className="hover-directive">Hover the scene<br/>to bring it forward</p></article>)}
        </div>
      </div>
    </section>
    <section className="about-section" id="about"><p className="kicker"><Asterisk size={15}/> Behind the pixels</p><div><h2>Engineering,<br/><em>with a pulse.</em></h2><aside><div className="portrait-wrap"><img src="https://github.com/Chachachaqiannnnn.png?size=320" alt="Hong Chia Qian"/><span>Developer<br/>Artist<br/>Explorer</span></div><p>I&apos;m Hong Chia Qian, a Multimedia University student and builder. I want software to be useful, thoughtful and impossible to confuse with anybody else&apos;s.</p><p className="personal-note">Right now I&apos;m building CogniPlan as my final-year project, exploring evidence-based study scheduling, and sharpening my craft through automation, algorithms and software verification.</p><div className="about-facts"><span><b>Current obsession</b>Learning technology</span><span><b>Building with</b>TypeScript · Python · Java</span><span><b>I care about</b>Clarity · Quality · Feeling</span><span><b>Working rhythm</b>Build · Test · Refine</span></div><a className="profile-link" href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer"><Code2 size={18}/> Enter my GitHub universe <ArrowUpRight size={18}/></a></aside></div></section>
    <footer><p>Have a strange idea?</p><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer">Let&apos;s create <ArrowUpRight/></a><div><span>© 2026 Chia Qian</span><span><a href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer"><Code2 size={16}/> GitHub</a><a href="https://cogniplan-f615f.web.app" target="_blank" rel="noreferrer"><ArrowUpRight size={16}/> CogniPlan</a></span></div></footer>
    <Dialog open={Boolean(selectedProject)} onOpenChange={(open)=>!open&&setSelectedProject(null)}><DialogContent className="project-dialog" style={{"--chapter-color":selectedProject?.color} as React.CSSProperties}>{selectedProject&&<><DialogHeader><DialogDescription>{selectedProject.index} / {selectedProject.category} · {selectedProject.year}</DialogDescription><DialogTitle>{selectedProject.title}</DialogTitle></DialogHeader><div className="dialog-visual"><i/><i/><i/><b>{selectedProject.index}</b></div><p>{selectedProject.description}</p><div className="dialog-stack">{selectedProject.stack.map((item)=><span key={item}>{item}</span>)}</div><div className="dialog-actions"><a href={selectedProject.github} target="_blank" rel="noreferrer"><Code2 size={18}/> GitHub source</a>{selectedProject.live&&<a href={selectedProject.live} target="_blank" rel="noreferrer">Open live app <ArrowUpRight size={18}/></a>}</div></>}</DialogContent></Dialog>
  </main>
}
