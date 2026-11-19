import { ArrowUpRight, ArrowDownRight, ArrowDown, ArrowLeft, ArrowRight, Sparks, Star, Heart, Flash, ArrowSeparate } from 'iconoir-react';
import React,{useEffect,useRef} from 'react';
import parse from 'html-react-parser';
import {useLocation} from 'react-router-dom';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import pages from '../pages/content.json';
gsap.registerPlugin(ScrollTrigger);
const contentIcons = {ArrowUpRight, ArrowDownRight, ArrowDown, ArrowLeft, ArrowRight, Sparks, Star, Heart, Flash, ArrowSeparate};

const contentOptions = {
 replace: ({attribs}) => {
  const name = attribs?.['data-icon'];
  if (!name || !Object.hasOwn(contentIcons, name)) return;
  const Icon = contentIcons[name];
  return <Icon className="content-icon" aria-hidden="true" focusable="false" />;
 },
};
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
  const reviewTrack = node.querySelector('.review-slider .review-grid');
  if (reviewTrack) {
   const reviews = Array.from(reviewTrack.children);
   const previous = node.querySelector('.reviews-prev');
   const next = node.querySelector('.reviews-next');
   const status = node.querySelector('.review-position');
   const currentReview = () => Math.round(reviewTrack.scrollLeft / (reviewTrack.clientWidth || 1));
   const updateControls = () => {
    const index = currentReview();
    status.textContent = `${index + 1} / ${reviews.length}`;
    previous.disabled = index === 0;
    next.disabled = index === reviews.length - 1;
   };
   const moveReview = (direction) => {
    const index = Math.max(0, Math.min(reviews.length - 1, currentReview() + direction));
    reviewTrack.scrollTo({left: index * reviewTrack.clientWidth, behavior: reduced ? 'instant' : 'smooth'});
   };
   previous.addEventListener('click', () => moveReview(-1), {signal});
   next.addEventListener('click', () => moveReview(1), {signal});
   reviewTrack.addEventListener('scroll', updateControls, {passive: true, signal});
   updateControls();
  }

  const video = node.querySelector('.hero-video');
  if (video && !reduced) {
   video.muted = true;
   video.play().catch(() => {});
  }
  const journeyWord = node.querySelector('.journey-word');
  let journeyTimer;
  if (journeyWord && !reduced) {
   const words = ['Journey', 'Ecosystem', 'Build'];
   let wordIndex = 0;
   let length = words[0].length;
   let deleting = true;

   const typeNext = () => {
    length += deleting ? -1 : 1;
    journeyWord.textContent = words[wordIndex].slice(0, length);
    if (length === 0) {
     wordIndex = (wordIndex + 1) % words.length;
     deleting = false;
     journeyTimer = window.setTimeout(typeNext, 250);
    } else if (length === words[wordIndex].length) {
     deleting = true;
     journeyTimer = window.setTimeout(typeNext, 1300);
    } else {
     journeyTimer = window.setTimeout(typeNext, deleting ? 65 : 110);
    }
   };

   journeyTimer = window.setTimeout(typeNext, 1300);
  }

  let ctx, motion;
  if(!reduced){
   const experience = node.querySelector('.experience-stage');
   if (experience) {
    motion = gsap.matchMedia();
    motion.add('(min-width: 901px) and (min-height: 640px), (min-height: 800px)', () => {
     const track = experience.querySelector('.experience-stack');
     const cards = Array.from(track.children);
     const header = document.querySelector('.header');
     experience.classList.add('experience-stage--pinned');

     const timeline = gsap.timeline({
      scrollTrigger: {
       trigger: experience,
       start: () => {
         const available = window.innerHeight - header.offsetHeight;
         const inset = Math.max(12, (available - experience.offsetHeight) / 2);
         return `top ${header.offsetHeight + inset}px`;
        },
       end: () => `+=${window.innerHeight * (cards.length - 1)}`,
       pin: true,
       scrub: true,
       refreshPriority: 1,
      },
     });

     cards.forEach((card, index) => {
      timeline.addLabel(`card-${index}`, index);
      if (index === 0) return;
      gsap.set(card, {yPercent: 105, y: index * 10, opacity: 0, pointerEvents: 'none'});
      const entrance = index - 0.8;
      timeline.set(card, {pointerEvents: 'auto'}, entrance);
      timeline.to(card, {opacity: 1, duration: 0.12, ease: 'none'}, entrance);
      timeline.to(card, {
       yPercent: 0,
       duration: 0.65,
       ease: 'power1.inOut',
      }, entrance);
     });
     timeline.to({}, {duration: 0.2}, cards.length - 1);

     return () => {
      experience.classList.remove('experience-stage--pinned');
     };
    });
   }

   const ecosystem = node.querySelector('.home-ecosystem');
   if (ecosystem) {
    motion ??= gsap.matchMedia();
    motion.add('(min-height: 560px)', () => {
     const viewport = ecosystem.querySelector('.eco-viewport');
     const track = viewport.querySelector('.eco-grid');
     const header = document.querySelector('.header');
     ecosystem.classList.add('ecosystem-pinned');
     const lastCard = track.lastElementChild;
     const travel = () => {
      const cardEnd = lastCard.getBoundingClientRect().right - track.getBoundingClientRect().left;
      const gutter = parseFloat(getComputedStyle(track).paddingInlineEnd);
      return Math.max(0, cardEnd + gutter - viewport.clientWidth);
     };
     const animation = gsap.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
       trigger: ecosystem,
       start: () => `top ${header.offsetHeight}px`,
       end: () => `+=${Math.max(travel(), window.innerHeight)}`,
       pin: true,
       scrub: true,
       invalidateOnRefresh: true,
       refreshPriority: 1.5,
      },
     });

     const showFocusedCard = ({target}) => {
      const card = target.closest('.eco-card');
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      const frame = viewport.getBoundingClientRect();
      if (bounds.left >= frame.left - 1 && bounds.right <= frame.right + 1) return;
      const trigger = animation.scrollTrigger;
      const offset = bounds.left - track.getBoundingClientRect().left;
      const progress = gsap.utils.clamp(0, 1, offset / (travel() || 1));
      trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
     };
     let lastTravel = travel();
     let refreshFrame;
     const layoutObserver = new ResizeObserver(() => {
      const nextTravel = travel();
      if (nextTravel === lastTravel) return;
      lastTravel = nextTravel;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
     });
     layoutObserver.observe(viewport);
     Array.from(track.children).forEach(card => layoutObserver.observe(card));
     track.addEventListener('focusin', showFocusedCard);
     return () => {
      layoutObserver.disconnect();
      cancelAnimationFrame(refreshFrame);
      track.removeEventListener('focusin', showFocusedCard);
      ecosystem.classList.remove('ecosystem-pinned');
     };
    });
   }

   ctx=gsap.context(()=>{
    const statement = node.querySelector('.journey-statement');
    if (statement) {
     const header = document.querySelector('.header');
     const section = statement.closest('.one-journey');
     const reveal = gsap.timeline({
      scrollTrigger: {
       trigger: section,
       start: () => `top ${header.offsetHeight}px`,
       end: () => `+=${Math.round(window.innerHeight * 1.4)}`,
       pin: true,
       scrub: true,
       refreshPriority: 2,
      },
     });
     reveal.from(statement.querySelectorAll('p > span'), {
      opacity: 0,
      duration: 0.25,
      stagger: 0.16,
      ease: 'none',
     });
     const transitionStart = reveal.duration() * 0.4;
     const transitionDuration = reveal.duration() * 0.22;
     reveal.to(section.querySelector('.journey-image-first'), {
      opacity: 0,
      duration: transitionDuration,
      ease: 'none',
     }, transitionStart);
     reveal.to(section.querySelector('.journey-image-second'), {
      opacity: 1,
      duration: transitionDuration,
      ease: 'none',
     }, transitionStart);
    }

    gsap.from('.hero .kicker,.hero h1,.hero-aside,.hero-center .micro-label,.hero-center h1,.hero-center p',{y:40,autoAlpha:0,duration:1,stagger:.13,ease:'power3.out',clearProps:'all'});
    gsap.utils.toArray('[data-reveal]:not(.experience-card)').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%',once:true},autoAlpha:0,y:42,duration:.8,ease:'power2.out',clearProps:'all'}));
    gsap.utils.toArray('[data-stagger]').forEach(group=>gsap.from(group.children,{scrollTrigger:{trigger:group,start:'top 90%',once:true},autoAlpha:0,y:40,duration:.8,stagger:.1,ease:'power2.out',clearProps:'all'}));
    gsap.utils.toArray('.experience-art .kiwi').forEach(el=>gsap.to(el,{y:-12,rotation:8,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    gsap.utils.toArray('[data-parallax]').forEach(el=>gsap.fromTo(el,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
   },node);
   node.querySelectorAll('.tier').forEach(card=>{
    card.addEventListener('pointermove',e=>{if(window.innerWidth<900)return;const r=card.getBoundingClientRect();card.style.transform=`perspective(1000px) rotateY(${((e.clientX-r.left)/r.width-.5)*9}deg) rotateX(${((e.clientY-r.top)/r.height-.5)*-9}deg) translateY(-5px)`},{signal});
    card.addEventListener('pointerleave',()=>card.style.transform='',{signal});
   });
  }
  return ()=>{window.clearTimeout(journeyTimer);controller.abort();ctx?.revert();motion?.revert();ScrollTrigger.refresh()};
 },[pathname,page.title,page.description]);
 const html = import.meta.env.MODE === 'pages'
  ? page.html
   .replace(/href="(\/[^"/][^"]*)"/g, 'href="#$1"')
   .replace(/(src|poster)="\/([^"/][^"]*)"/g, '$1="./$2"')
  : page.html;
 return <div ref={root} key={pathname}>{parse(html, contentOptions)}</div>;
}
