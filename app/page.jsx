"use client";
import { useEffect } from "react";

export default function HomePage(){
  useEffect(()=>{
    document.querySelector('[data-year]').textContent = new Date().getFullYear();
  },[]);

  return (
    <main style={{minHeight:'100vh',background:'#050505',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'24px',textAlign:'center',padding:'24px'}}>
      <h1 style={{fontSize:'42px',letterSpacing:'-1px'}}>Jordan Bailey</h1>
      <p style={{opacity:.7,maxWidth:'520px'}}>Voice actor. English + German. Controlled, cinematic, real presence.</p>

      <img src="/media/gallery/final-project-reaction.gif" alt="reaction" style={{width:'220px',borderRadius:'12px'}} />
      <p style={{opacity:.6,fontSize:'14px'}}>My honest reaction when I send you the final project.</p>

      <a href="mailto:jrdnbailey23@gmail.com" style={{marginTop:'12px',padding:'12px 20px',background:'#fff',color:'#000',borderRadius:'8px',fontWeight:600}}>Book Jordan</a>

      <p style={{opacity:.4,fontSize:'12px'}}>© <span data-year></span></p>
    </main>
  )
}
