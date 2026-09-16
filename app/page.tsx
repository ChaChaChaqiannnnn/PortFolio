"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDown, ArrowUpRight, Asterisk, Code2, MousePointer2, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Project = { id:string; index:string; title:string; category:string; year:string; description:string; stack:string[]; color:string; github:string; live?:string };
const projects:Project[] = [
  { id:"cogniplan",index:"01",title:"CogniPlan",category:"Learning / Product",year:"2026",description:"An intelligent, mobile-first study planner using spaced repetition, cognitive-load signals and role-based dashboards to help students learn with intention.",stack:["React Native","TypeScript","Firebase","FSRS"],color:"#c6adff",github:"https://github.com/ChaChaChaqiannnnn/CogniPlan-main",live:"https://cogniplan-f615f.web.app" },
  { id:"svv",index:"02",title:"Web Verification Lab",category:"Automation / Quality",year:"2026",description:"A three-layer testing and performance suite that verifies live web experiences, captures visual evidence and monitors availability over time.",stack:["Python","Selenium","BeautifulSoup","Chrome"],color:"#83e4cf",github:"https://github.com/ChaChaChaqiannnnn/SVV" },
  { id:"algo",index:"03",title:"Algorithm Atelier",category:"Algorithms / Research",year:"2025",description:"An analytical implementation of merge sort, quick sort and binary search across large generated datasets, comparing time and space behaviour.",stack:["Java","Python","Algorithms","Data"],color:"#ffd071",github:"https://github.com/ChaChaChaqiannnnn/Algo" },
  { id:"shopease",index:"04",title:"ShopEase System",category:"Software / Architecture",year:"2025",description:"A Java software-design study exploring maintainable structure, object modelling and implementation discipline through a complete commerce domain.",stack:["Java","OOP","Architecture"],color:"#ff93bd",github:"https://github.com/ChaChaChaqiannnnn/SD_ass" },
];
const sceneColors=["#b79cff",...projects.map((project)=>project.color)];

function CinematicWorld(){
  const mountRef=useRef<HTMLDivElement>(null);
  const scrollRef=useRef(0);

  useEffect(()=>{
    const mount=mountRef.current;if(!mount)return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x08070b,8,31);
    const camera=new THREE.PerspectiveCamera(44,1,.1,80);camera.position.set(0,0,8.2);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;mount.appendChild(renderer.domElement);
    const worlds:THREE.Group[]=[];const materials:THREE.MeshPhysicalMaterial[]=[];

    for(let index=0;index<5;index+=1){
      const world=new THREE.Group();world.position.set(index%2?1.05:-1.05,0,-index*7);scene.add(world);worlds.push(world);
      const color=new THREE.Color(sceneColors[index]);
      const material=new THREE.MeshPhysicalMaterial({color,roughness:.14,metalness:.03,transmission:index===0?.16:.34,thickness:1.8,clearcoat:1,clearcoatRoughness:.08});materials.push(material);
      if(index===0){
        world.add(new THREE.Mesh(new THREE.TorusKnotGeometry(1.34,.32,220,32,2,3),material));
        for(let ringIndex=0;ringIndex<3;ringIndex+=1){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.15+ringIndex*.42,.018+ringIndex*.006,10,150),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.52-ringIndex*.11}));ring.rotation.set(.85+ringIndex*.34,ringIndex*.72,ringIndex*.4);ring.userData.speed=ringIndex%2?-.12:.1;world.add(ring)}
      }else{
        const monolith=new THREE.Mesh(new THREE.BoxGeometry(2.55,3.5,.32,8,12,2),material);monolith.rotation.z=index%2?-.08:.08;world.add(monolith);
        const edges=new THREE.LineSegments(new THREE.EdgesGeometry(monolith.geometry),new THREE.LineBasicMaterial({color:0xfffbff,transparent:true,opacity:.5}));edges.rotation.copy(monolith.rotation);world.add(edges);
        const portal=new THREE.Mesh(new THREE.TorusGeometry(2.45,.035,12,180),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.72}));portal.rotation.x=.35+index*.2;portal.rotation.y=.72;portal.userData.speed=index%2?.11:-.11;world.add(portal);
        for(let shardIndex=0;shardIndex<5;shardIndex+=1){const shard=new THREE.Mesh(new THREE.OctahedronGeometry(.16+(shardIndex%2)*.08,0),new THREE.MeshStandardMaterial({color,roughness:.2}));const angle=(shardIndex/5)*Math.PI*2;shard.position.set(Math.cos(angle)*2.2,Math.sin(angle)*1.55,.5+(shardIndex%3)*.35);shard.userData.offset=shardIndex*.9;world.add(shard)}
      }
    }

    const dustGeometry=new THREE.BufferGeometry();const points=new Float32Array(520*3);
    for(let i=0;i<520;i+=1){const a=Math.sin(i*127.1)*43758.5453;const b=Math.sin(i*311.7)*21423.341;points[i*3]=(a-Math.floor(a)-.5)*22;points[i*3+1]=(b-Math.floor(b)-.5)*13;points[i*3+2]=5-(i%58)*.75}
    dustGeometry.setAttribute("position",new THREE.BufferAttribute(points,3));const dustMaterial=new THREE.PointsMaterial({color:0xffeafa,size:.026,transparent:true,opacity:.64});const dust=new THREE.Points(dustGeometry,dustMaterial);scene.add(dust);
    scene.add(new THREE.HemisphereLight(0xeee7ff,0x241331,2.4));const key=new THREE.PointLight(0xffd7eb,62,18);const rim=new THREE.PointLight(0x8ee8d8,45,15);scene.add(key,rim);
    let pointerX=0,pointerY=0,impulse=0,frame=0;const lookTarget=new THREE.Vector3();const scaleTarget=new THREE.Vector3();const timer=new THREE.Timer();timer.connect(document);
    const updateScroll=()=>{scrollRef.current=Math.min(4,window.scrollY/Math.max(window.innerHeight*1.25,1))};
    const move=(event:PointerEvent)=>{const rect=mount.getBoundingClientRect();pointerX=((event.clientX-rect.left)/rect.width-.5)*2;pointerY=((event.clientY-rect.top)/rect.height-.5)*2};
    const down=()=>{impulse=1};
    const resize=()=>{const width=mount.clientWidth,height=mount.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix()};
    const animate=()=>{timer.update();const time=timer.getElapsed(),scroll=scrollRef.current,cameraZ=8.2-scroll*7;camera.position.x+=(Math.sin(scroll*Math.PI)*.38+pointerX*.12-camera.position.x)*.035;camera.position.y+=(-pointerY*.1-camera.position.y)*.035;camera.position.z+=(cameraZ-camera.position.z)*.05;lookTarget.set(Math.sin(scroll*Math.PI)*.32,0,cameraZ-8.2);camera.lookAt(lookTarget);camera.rotation.z+=Math.sin(scroll*Math.PI)*-.025;key.position.set(3+pointerX,4,cameraZ+1);rim.position.set(-4,-2,cameraZ-2);dust.position.z=cameraZ-6;
      worlds.forEach((world,index)=>{const distance=Math.abs(scroll-index),focus=Math.max(0,1-distance),scale=.78+focus*.22+impulse*focus*.07;scaleTarget.setScalar(scale);world.scale.lerp(scaleTarget,.05);world.rotation.y+=((scroll-index)*.22+pointerX*.06-world.rotation.y)*.035;world.rotation.x+=(-pointerY*.035-world.rotation.x)*.035;world.children.forEach((child)=>{if(child.userData.speed&&!reduced)child.rotation.z+=child.userData.speed*.01;if(typeof child.userData.offset==="number"&&!reduced)child.position.y+=Math.sin(time+child.userData.offset)*.0018});materials[index].emissive.set(sceneColors[index]);materials[index].emissiveIntensity=.015+focus*.08});
      impulse*=.86;if(!reduced)dust.rotation.z=time*.0025;renderer.render(scene,camera);frame=requestAnimationFrame(animate)};
    resize();updateScroll();animate();mount.addEventListener("pointermove",move);mount.addEventListener("pointerdown",down);window.addEventListener("scroll",updateScroll,{passive:true});window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(frame);timer.dispose();mount.removeEventListener("pointermove",move);mount.removeEventListener("pointerdown",down);window.removeEventListener("scroll",updateScroll);window.removeEventListener("resize",resize);scene.traverse((object)=>{const renderable=object as THREE.Mesh;if(renderable.geometry)renderable.geometry.dispose();const material=renderable.material;if(Array.isArray(material))material.forEach((item)=>item.dispose());else if(material instanceof THREE.Material)material.dispose()});renderer.dispose();renderer.domElement.remove()};
  },[]);
  return <div ref={mountRef} className="world-canvas" aria-label="An interactive cinematic 3D journey through Chia Qian's work" role="img"/>;
}

function Cursor(){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{if(!window.matchMedia("(pointer:fine)").matches)return;const cursor=ref.current;if(!cursor)return;const move=(event:PointerEvent)=>{cursor.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`};const hover=(event:PointerEvent)=>{cursor.classList.toggle("is-hover",Boolean((event.target as Element)?.closest("a,button")))};window.addEventListener("pointermove",move);window.addEventListener("pointerover",hover);return()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerover",hover)}},[]);return <div ref={ref} className="cursor" aria-hidden="true"><span/></div>}

export default function Home(){
  const [activeIndex,setActiveIndex]=useState(0);const [selectedProject,setSelectedProject]=useState<Project|null>(null);const [booting,setBooting]=useState(true);
  useEffect(()=>{const timer=window.setTimeout(()=>setBooting(false),1650);return()=>window.clearTimeout(timer)},[]);
  useEffect(()=>{const observer=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting)setActiveIndex(Number((entry.target as HTMLElement).dataset.index))}),{threshold:.52});document.querySelectorAll(".story-chapter").forEach((chapter)=>observer.observe(chapter));const update=()=>document.documentElement.style.setProperty("--scroll",String(window.scrollY/Math.max(document.documentElement.scrollHeight-window.innerHeight,1)));update();window.addEventListener("scroll",update,{passive:true});return()=>{observer.disconnect();window.removeEventListener("scroll",update)}},[]);
  return <main>
    <Cursor/>
    <div className={`opening-credit ${booting?"is-playing":"is-finished"}`} aria-hidden={!booting}><p>Hong Chia Qian presents</p><h2>A portfolio<br/><em>in motion</em></h2><span>Creative technologist · MMU · 2026</span></div>
    <div className="page-progress" aria-hidden="true"/>
    <nav className="nav-shell"><a className="wordmark" href="#top">CQ</a><p>Creative technologist<br/>Kuala Lumpur · MY</p><div><a href="#work">Work</a><a href="#about">About</a><a href="/hong-chia-qian-resume.pdf" download>Resume ↓</a><a href="mailto:hongchiaqian@gmail.com">Contact ↗</a></div></nav>
    <section className="film" id="top">
      <div className="film-stage"><CinematicWorld/><div className="light-leak"/><div className="film-noise"/><div className="letterbox top"/><div className="letterbox bottom"/><p className="scene-code">SCENE {String(activeIndex).padStart(2,"0")} / 04</p><p className="sound-note">BEST VIEWED WITH<br/>CURIOSITY ON</p><div className="timeline"><i/><span style={{"--scene":activeIndex} as React.CSSProperties}/></div></div>
      <div className="story">
        <article className={`story-chapter hero ${activeIndex===0?"is-active":""}`} data-index="0"><p className="sup-title">An interactive portfolio by Hong Chia Qian</p><h1><span>I build ideas</span><br/><em>you can feel.</em></h1><div className="hero-bottom"><p>Graduated software engineer and creative developer open to job opportunities. I build dependable digital products with thoughtful interaction, strong testing, and a distinctive visual point of view.</p><a href="#work"><ArrowDown size={16}/> View my work</a></div><div className="scroll-cue"><MousePointer2 size={15}/><span>Scroll to move the camera</span></div></article>
        <div id="work">{projects.map((project,index)=><article id={project.id} className={`story-chapter project-scene ${index%2?"right":"left"} ${activeIndex===index+1?"is-active":""}`} data-index={index+1} key={project.id} style={{"--accent":project.color} as React.CSSProperties}><p className="scene-direction">{project.index} — {project.category}<span>{project.year}</span></p><div className="project-title"><span className="ghost-number">{project.index}</span><h2>{project.title}</h2></div><div className="project-detail"><p>{project.description}</p><div className="tags">{project.stack.map((item)=><span key={item}>{item}</span>)}</div><div className="project-links"><button onClick={()=>setSelectedProject(project)}><Play size={14} fill="currentColor"/> View chapter</button><a href={project.github} target="_blank" rel="noreferrer"><Code2 size={15}/> Source</a>{project.live&&<a href={project.live} target="_blank" rel="noreferrer">Live <ArrowUpRight size={15}/></a>}</div></div></article>)}</div>
      </div>
    </section>
    <section className="about-section" id="about"><p className="sup-title"><Asterisk size={14}/> The person behind the frame</p><div className="about-grid"><h2>Logic in my head.<br/><em>Colour in my heart.</em></h2><div className="about-copy"><div className="portrait"><img src="https://github.com/Chachachaqiannnnn.png?size=320" alt="Hong Chia Qian"/><span>That&apos;s me<br/>Hello :)</span></div><p>I&apos;m Hong Chia Qian, a Multimedia University developer who wants useful software to carry personality. I care about the invisible engineering—and the feeling people remember.</p><p className="small">My current focus is CogniPlan, my final-year project exploring evidence-based study scheduling. Around it, I keep experimenting with testing, algorithms, motion and creative code.</p><div className="facts"><span><b>Build</b>TypeScript · Python · Java</span><span><b>Believe</b>Clarity · Quality · Feeling</span></div><div className="contact-actions"><a className="profile-link" href="https://github.com/ChaChaChaqiannnnn" target="_blank" rel="noreferrer"><Code2 size={17}/> Explore my GitHub <ArrowUpRight size={17}/></a><a className="email-link" href="mailto:hongchiaqian@gmail.com">hongchiaqian@gmail.com <ArrowUpRight size={16}/></a></div></div></div></section>
    <footer><p>End scene / New beginning</p><h2>Have a strange<br/><em>idea?</em></h2><a href="mailto:hongchiaqian@gmail.com">Let&apos;s make it real <ArrowUpRight/></a><div><span>© 2026 Hong Chia Qian</span><span><a href="mailto:hongchiaqian@gmail.com">hongchiaqian@gmail.com</a> · Built with code, light and a little chaos.</span></div></footer>
    <Dialog open={Boolean(selectedProject)} onOpenChange={(open)=>!open&&setSelectedProject(null)}><DialogContent className="project-dialog" style={{"--accent":selectedProject?.color} as React.CSSProperties}>{selectedProject&&<><DialogHeader><DialogDescription>Chapter {selectedProject.index} · {selectedProject.category} · {selectedProject.year}</DialogDescription><DialogTitle>{selectedProject.title}</DialogTitle></DialogHeader><div className="dialog-frame"><b>{selectedProject.index}</b><i/><i/><span>CASE FILE / CQ</span></div><p>{selectedProject.description}</p><div className="tags dialog-tags">{selectedProject.stack.map((item)=><span key={item}>{item}</span>)}</div><div className="dialog-links"><a href={selectedProject.github} target="_blank" rel="noreferrer"><Code2 size={17}/> GitHub source</a>{selectedProject.live&&<a href={selectedProject.live} target="_blank" rel="noreferrer">Open live app <ArrowUpRight size={17}/></a>}</div></>}</DialogContent></Dialog>
  </main>;
}
