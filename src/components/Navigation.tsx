'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CAL_LINK = 'https://cal.com/caterpillar.ai/quick-chat';

const navLinks = [
  { href: '/#method', label: 'Method' },
  { href: '/#services', label: 'Services' },
  { href: '/#trainings', label: 'Trainings' },
  { href: '/#about', label: 'About' },
  { href: '/scores', label: 'Model Scores' },
  { href: '/prompts', label: 'Prompts' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="nav col" aria-label="Main">
      <div className="nav-bar">
        <Link href="/" className="brand">
          <Image src="/logos/caterpillar-logo.png" alt="" width={26} height={26} priority />
          Caterpillar AI Consulting
        </Link>

        <div className="links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="btn sm" href={CAL_LINK} target="_blank" rel="noopener noreferrer">
            Book a call
          </a>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="mobile-menu">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            className="btn"
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book a call
          </a>
        </div>
      )}
    </nav>
  );
}
