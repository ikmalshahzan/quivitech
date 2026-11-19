import React,{useEffect,useRef} from 'react';
import parse from 'html-react-parser';
import {useLocation} from 'react-router-dom';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import pages from '../pages/content.json';
gsap.registerPlugin(ScrollTrigger);
export default function ContentPage(){
 const {pathname}=useLocation();
 const root=useRef(null);
 const page=pages[pathname]||pages['/'];
 useEffect(()=>{
  document.title=page.title;
  let meta=document.querySelector('meta[name="description"]');
  if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}
  meta.content=page.description;
  const node=root.current;
  const controller=new AbortController(),signal=controller.signal;
  node.querySelectorAll('.faq-trigger').forEach(btn=>btn.addEventListener('click',()=>btn.setAttribute('aria-expanded',String(btn.getAttribute('aria-expanded')!=='true')),{signal}));
  node.querySelectorAll('.slider input').forEach(input=>input.addEventListener('input',e=>e.target.closest('.slider').style.setProperty('--split',e.target.value+'%'),{signal}));
  node.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const status=form.querySelector('[role="status"]');if(status)status.textContent='Demo only: connect this form to your preferred email or CRM before launch.'},{signal}));
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ctx;
  if(!reduced){
   ctx=gsap.context(()=>{
    gsap.from('.hero .kicker,.hero h1,.hero-aside,.hero-center .micro-label,.hero-center h1,.hero-center p',{y:40,autoAlpha:0,duration:1,stagger:.13,ease:'power3.out',clearProps:'all'});
    gsap.utils.toArray('[data-reveal]').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%',once:true},autoAlpha:0,y:42,duration:.8,ease:'power2.out',clearProps:'all'}));
    gsap.utils.toArray('[data-stagger]').forEach(group=>gsap.from(group.children,{scrollTrigger:{trigger:group,start:'top 90%',once:true},autoAlpha:0,y:40,duration:.8,stagger:.1,ease:'power2.out',clearProps:'all'}));
    gsap.utils.toArray('.experience-art .kiwi').forEach(el=>gsap.to(el,{y:-12,rotation:8,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    gsap.utils.toArray('[data-parallax]').forEach(el=>gsap.fromTo(el,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
   },node);
   node.querySelectorAll('.tier').forEach(card=>{
    card.addEventListener('pointermove',e=>{if(window.innerWidth<900)return;const r=card.getBoundingClientRect();card.style.transform=`perspective(1000px) rotateY(${((e.clientX-r.left)/r.width-.5)*9}deg) rotateX(${((e.clientY-r.top)/r.height-.5)*-9}deg) translateY(-5px)`},{signal});
    card.addEventListener('pointerleave',()=>card.style.transform='',{signal});
   });
  }
  return ()=>{controller.abort();ctx?.revert();ScrollTrigger.refresh()};
 },[pathname,page.title,page.description]);
 const html = import.meta.env.MODE === 'pages'
  ? page.html.replace(/href="(\/[^"/][^"]*)"/g, 'href="#$1"')
  : page.html;
 return <div ref={root} key={pathname}>{parse(html)}</div>;
}
