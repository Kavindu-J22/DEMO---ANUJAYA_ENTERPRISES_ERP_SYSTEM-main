import React from 'react';

export function CompanyLogo({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="erpGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="erpGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="erpGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="erpGradRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <filter id="erpBadgeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Base Badge */}
      <circle cx="100" cy="100" r="92" fill="#ffffff" filter="url(#erpBadgeShadow)" />

      {/* Precision Orbital Ring */}
      <circle cx="100" cy="100" r="85" stroke="url(#erpGradRing)" strokeWidth="3.5" strokeDasharray="14 6" opacity="0.85" />
      <circle cx="100" cy="100" r="77" stroke="#e2e8f0" strokeWidth="1.5" />

      {/* Modern 3D Isometric Enterprise Core */}
      <g transform="translate(100, 100)">
        {/* Top Facet (Cloud & Intelligence) */}
        <path d="M 0,-52 L 46,-26 L 0,0 L -46,-26 Z" fill="url(#erpGradTop)" />
        <path d="M 0,-44 L 38,-23 L 0,0 L -38,-23 Z" fill="#ffffff" opacity="0.18" />

        {/* Left Facet (Operations & Supply Chain) */}
        <path d="M -46,-26 L 0,0 L 0,52 L -46,26 Z" fill="url(#erpGradLeft)" />
        <path d="M -38,-16 L -8,0 L -8,42 L -38,24 Z" fill="#ffffff" opacity="0.1" />

        {/* Right Facet (Finance & Global Logistics) */}
        <path d="M 0,0 L 46,-26 L 46,26 L 0,52 Z" fill="url(#erpGradRight)" />
        <path d="M 8,0 L 38,-16 L 38,24 L 8,42 Z" fill="#ffffff" opacity="0.1" />

        {/* Central Glowing Nexus Node */}
        <circle cx="0" cy="0" r="11" fill="#ffffff" filter="url(#erpBadgeShadow)" />
        <circle cx="0" cy="0" r="7" fill="#0284c7" />
        <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
      </g>
    </svg>
  );
}

export function MockBarcode({ code = "ERP-DOC-2026" }) {
  return (
    <div className="flex flex-col items-end print:items-end">
      <svg className="h-7 w-28" viewBox="0 0 100 22" preserveAspectRatio="none">
        <rect x="0" y="0" width="3" height="22" fill="#0f172a" />
        <rect x="5" y="0" width="1" height="22" fill="#0f172a" />
        <rect x="8" y="0" width="4" height="22" fill="#0f172a" />
        <rect x="15" y="0" width="2" height="22" fill="#0f172a" />
        <rect x="19" y="0" width="1" height="22" fill="#0f172a" />
        <rect x="23" y="0" width="5" height="22" fill="#0f172a" />
        <rect x="31" y="0" width="2" height="22" fill="#0f172a" />
        <rect x="35" y="0" width="3" height="22" fill="#0f172a" />
        <rect x="40" y="0" width="1" height="22" fill="#0f172a" />
        <rect x="44" y="0" width="4" height="22" fill="#0f172a" />
        <rect x="51" y="0" width="2" height="22" fill="#0f172a" />
        <rect x="55" y="0" width="3" height="22" fill="#0f172a" />
        <rect x="60" y="0" width="1" height="22" fill="#0f172a" />
        <rect x="64" y="0" width="4" height="22" fill="#0f172a" />
        <rect x="70" y="0" width="2" height="22" fill="#0f172a" />
        <rect x="74" y="0" width="5" height="22" fill="#0f172a" />
        <rect x="81" y="0" width="1" height="22" fill="#0f172a" />
        <rect x="84" y="0" width="3" height="22" fill="#0f172a" />
        <rect x="89" y="0" width="2" height="22" fill="#0f172a" />
        <rect x="93" y="0" width="4" height="22" fill="#0f172a" />
        <rect x="98" y="0" width="2" height="22" fill="#0f172a" />
      </svg>
      <span className="font-mono text-[8px] text-slate-500 tracking-widest uppercase mt-0.5">{code}</span>
    </div>
  );
}

export function OfficialSealStamp() {
  return (
    <div className="relative inline-flex items-center justify-center p-1.5 border-2 border-emerald-600 rounded-full text-emerald-700 font-mono rotate-[-5deg] select-none opacity-90 shadow-sm bg-white">
      <div className="border border-dashed border-emerald-500 rounded-full px-3 py-2 text-center">
        <div className="text-[8px] font-black tracking-widest uppercase text-emerald-800">ENTERPRISES ERP SOLUTIONS</div>
        <div className="text-[7px] font-bold text-slate-800">★ CERTIFIED INDUSTRIAL YARD ★</div>
        <div className="text-[7px] font-extrabold text-emerald-800 tracking-wider">CENTRAL OPERATIONS HUB</div>
        <div className="text-[6px] text-slate-500 font-mono uppercase tracking-widest">OFFICIALLY VERIFIED</div>
      </div>
    </div>
  );
}
