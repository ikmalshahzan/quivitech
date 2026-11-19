import React,{useState} from 'react';
import {Link,NavLink,Outlet,useLocation} from 'react-router-dom';
const craft=[['Overview','/quivicraft'],['Craft Details','/quivicraft/details'],['QuiviServe','/quivicraft/serve'],['QuiviCare','/quivicraft/care'],['QuiviThread','/quivicraft/thread']];
const nav=[['Home','/'],['Quivi Plus','/quiviplus'],['Quivi Merch','/quivimerch'],['About Us','/about'],['Contact Us','/contact'],['Policies','/policies']];
export default function Layout(){
 const [menu,setMenu]=useState(false),[drop,setDrop]=useState(false);
 const location=useLocation();
 React.useEffect(()=>{setMenu(false);setDrop(false);window.scrollTo(0,0)},[location.pathname]);
 return <><a href="#main" className="skip">Skip to content</a><header className="header"><div className="container nav">
 <Link className="logo" to="/" aria-label="QuiviTech homepage">QUIVI<span className="dot">.</span>TECH</Link>
 <nav className={'nav-links '+(menu?'open':'')} id="primary-nav" aria-label="Main navigation">
 <NavLink to="/">Home</NavLink><div className="dropdown"><button type="button" aria-expanded={drop} onClick={()=>setDrop(v=>!v)}>Quivi Craft ▾</button>
 <div className="dropdown-panel" style={drop?{display:'flex'}:{}}>{craft.map(([name,url])=><Link key={url} to={url}>{name}</Link>)}</div></div>
 {nav.slice(1).map(([name,url])=><NavLink key={url} to={url}>{name}</NavLink>)}
 </nav><Link className="round-btn nav-quote" to="/contact">Dapatkan Sebut Harga ↗</Link>
 <button className="hamburger" aria-expanded={menu} aria-controls="primary-nav" aria-label="Toggle navigation" onClick={()=>setMenu(v=>!v)}>☰</button>
 </div></header><Outlet/><footer className="site-footer"><div className="container"><div className="footer-grid">
 <div><Link className="logo" to="/">QUIVI<span className="dot">.</span>TECH</Link><p>Harga Telus, Kualiti Memang Premium.</p><p>Custom PC builds, upgrades and care. Made for the way you work and play.</p></div>
 <div><h4>Quivi Craft</h4>{craft.map(([n,u])=><Link key={u} to={u}>{n}</Link>)}</div>
 <div><h4>Discover</h4><Link to="/quiviplus">Quivi Plus</Link><Link to="/quivimerch">Quivi Merch</Link><Link to="/about">About Us</Link></div>
 <div><h4>Support</h4><Link to="/contact">Contact Us</Link><Link to="/policies">Policies</Link><Link to="/contact">Request a quote</Link><p>Social accounts and location to be verified</p></div>
 </div><div className="footer-bottom"><span>© {new Date().getFullYear()} QuiviTech. All rights reserved.</span><span>Transparent prices. Premium craftsmanship.</span></div></div></footer></>;
}
