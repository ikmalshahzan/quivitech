import { Facebook, Instagram, Linkedin, Youtube } from 'iconoir-react';
import quiviLogo from '../quivitech-logo.png';
import React,{useState} from 'react';
import {Link,Outlet,useLocation} from 'react-router-dom';
export default function Layout(){
 const [menu,setMenu]=useState(false);
 const [headerAtTop, setHeaderAtTop] = useState(() => window.scrollY < 24);
 const [headerHidden, setHeaderHidden] = useState(false);
 const [headerHovered, setHeaderHovered] = useState(false);
 const [headerOpen, setHeaderOpen] = useState(false);
 const headerRevealed = headerHovered || headerOpen;
 const headerTab = React.useRef(null);
 const mobileMenuButton = React.useRef(null);
 const toggleHeaderTab = () => {
  if (window.matchMedia('(max-width: 800px)').matches) {
   setMenu(true);
   requestAnimationFrame(() => mobileMenuButton.current?.focus());
   return;
  }
  setHeaderOpen(open => !open);
 };
 const toggleMobileMenu = () => {
  setMenu(!menu);
  if (menu && headerHidden) {
   requestAnimationFrame(() => headerTab.current?.focus());
  }
 };

 React.useEffect(() => {
  let anchor = window.scrollY;
  const updateHeader = () => {
   const position = Math.max(0, window.scrollY);
   setHeaderAtTop(position < 24);
   if (position > 96 && Math.abs(position - anchor) < 10) return;
   const hide = position > 96 && position > anchor;
   anchor = position;
   setHeaderHidden(hide);
   if (!hide) {
    setHeaderHovered(false);
    setHeaderOpen(false);
   }
  };
  window.addEventListener('scroll', updateHeader, {passive: true});
  return () => window.removeEventListener('scroll', updateHeader);
 }, []);

 const footerWordmark = React.useRef(null);
 React.useEffect(() => {
  const wordmark = footerWordmark.current;
  if (!wordmark || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  wordmark.classList.add('footer-wordmark-pending');
  const observer = new IntersectionObserver(([entry]) => {
   if (!entry.isIntersecting) return;
   wordmark.classList.remove('footer-wordmark-pending');
   observer.disconnect();
  }, {threshold: 0.15});
  observer.observe(wordmark);
  return () => {
   observer.disconnect();
   wordmark.classList.remove('footer-wordmark-pending');
  };
 }, []);

 const location=useLocation();
 React.useEffect(() => {
  setMenu(false);
  setHeaderHidden(false);
  setHeaderHovered(false);
  setHeaderOpen(false);

  const sections = {
   '#ecosystem': 'ecosystem',
   '#experience': 'experience',
   '#quote-request': 'quote-request',
   '#page-content': 'page-content',
   '#merch-collection': 'merch-collection',
  };
  const id = sections[location.hash];
  if (!id) {
   window.scrollTo(0, 0);
   return;
  }

  const frame = window.requestAnimationFrame(() => {
   const section = document.getElementById(id);
   if (!section) return;
   const target = section.parentElement.matches('.pin-spacer') ? section.parentElement : section;
   const offset = document.querySelector('.header').offsetHeight;
   const top = window.scrollY + target.getBoundingClientRect().top - offset;
   const smooth = id !== 'quote-request' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   window.scrollTo({top, behavior: smooth ? 'smooth' : 'instant'});
  });
  return () => window.cancelAnimationFrame(frame);
 }, [location.key, location.hash]);

 return <><a href="#main" className="skip">Skip to content</a><header
  className={`header${location.pathname === '/' && headerAtTop ? ' header-over-hero' : ''}${headerHidden ? ' header-collapsed' : ''}${headerRevealed || menu ? ' header-revealed' : ''}${menu ? ' header-menu-open' : ''}`}
  onPointerLeave={() => setHeaderHovered(false)}
  onKeyDown={event => {
   if (event.key !== 'Escape') return;
   setHeaderOpen(false);
   setHeaderHovered(false);
   setMenu(false);
   if (menu && headerHidden) requestAnimationFrame(() => headerTab.current?.focus());
  }}
 ><div className="header-drawer">
 <button
  ref={headerTab}
  className="header-tab"
  type="button"
  aria-label="Toggle site header"
  aria-controls="header-content"
  aria-expanded={headerRevealed || menu}
  onPointerEnter={event => { if (event.pointerType === 'mouse') setHeaderHovered(true); }}
  onClick={toggleHeaderTab}
 ><span className="header-tab-icon" aria-hidden="true"></span></button>
 <div className="nav" id="header-content">
 <Link className="logo" to="/" aria-label="QuiviTech homepage"><img className="brand-logo" src={quiviLogo} alt="" /></Link>
 <nav className={'nav-links '+(menu?'open':'')} id="primary-nav" aria-label="Main navigation">
  <Link to="/" aria-current={location.pathname === '/' && !location.hash ? 'page' : undefined}>Home</Link>
  <Link to="/#ecosystem">Ecosystem</Link>
  <Link to="/#experience">Experience</Link>
  </nav>
 <Link className="round-btn header-contact" to="/contact">Contact Us</Link>
 <button ref={mobileMenuButton} className="hamburger" aria-expanded={menu} aria-controls="primary-nav" aria-label={menu ? "Close navigation" : "Open navigation"} onClick={toggleMobileMenu}><span className="mobile-menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
 </div></div></header><Outlet/><footer className="site-footer">
  <div className="footer-art">
   <Link className="logo" to="/" aria-label="QuiviTech homepage">
    <img className="brand-logo" src={quiviLogo} alt="" />
   </Link>
   <nav className="footer-links" aria-label="Footer navigation">
    <div>
     <h2>Quick Link</h2>
     <Link to="/quivicraft">Overview</Link>
     <Link to="/quivicraft/details">QuiviCraft</Link>
     <Link to="/quivicraft/serve">QuiviServe</Link>
     <Link to="/quivicraft/care">QuiviCare</Link>
     <Link to="/quivicraft/thread">QuiviThread</Link>
     <Link to="/quiviplus">QuiviPlus</Link>
     <Link to="/quivimerch">QuiviMerch</Link>
    </div>
    <div>
     <h2>Discover</h2>
     <Link to="/about">About Us</Link>
     <Link to="/contact">Contact Us</Link>
     <Link to="/policies">Policies</Link>
    </div>
    <div>
     <h2>Follow Us On</h2>
     <div className="footer-social">
      <Facebook role="img" aria-label="Facebook" />
      <Instagram role="img" aria-label="Instagram" />
      <Linkedin role="img" aria-label="LinkedIn" />
      <Youtube role="img" aria-label="YouTube" />
     </div>
    </div>
   </nav>
   <p ref={footerWordmark} className="footer-wordmark">Beyond Kiwi</p>
  </div>
  <div className="footer-copyright">© {new Date().getFullYear()} QuiviTech. All rights reserved.</div>
 </footer></>;
}
