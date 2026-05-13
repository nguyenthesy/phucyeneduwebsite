"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Khóa học", href: "#courses" },
    { name: "Về chúng tôi", href: "#about" },
    { name: "Tin tức", href: "#news" },
    { name: "Liên hệ", href: "#contact" },
  ];

  return (
    <>
      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <Image src="/logo.png" alt="Phúc Yên Edu" width={48} height={48} />
            <div className="logo-text">
              <span className="logo-name">PHÚC YÊN</span>
              <span className="logo-sub">EDU</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="nav-link">
                {link.name}
              </Link>
            ))}
            <Link href="#contact" className="btn btn-primary nav-cta">
              ĐĂNG KÝ NGAY
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link href="#contact" className="btn btn-primary" style={{ marginTop: "10px" }} onClick={() => setIsMenuOpen(false)}>
              ĐĂNG KÝ NGAY
            </Link>
          </div>
        )}
      </header>

      <style jsx>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 18px 0;
          background: transparent;
          transition: all 0.3s ease;
        }
        .site-header.scrolled {
          background: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          padding: 10px 0;
        }
        .header-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .logo-name {
          font-size: 1.3rem;
          font-weight: 800;
          color: ${isScrolled ? "#1A1A2E" : "#ffffff"};
          text-shadow: ${isScrolled ? "none" : "0 2px 8px rgba(0,0,0,0.5)"};
          letter-spacing: 1px;
        }
        .logo-sub {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 3px;
          color: ${isScrolled ? "#FF4500" : "#FFD700"};
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 35px;
        }
        .nav-link {
          font-size: 1rem;
          font-weight: 700;
          color: ${isScrolled ? "#1A1A2E" : "#ffffff"};
          text-shadow: ${isScrolled ? "none" : "0 2px 8px rgba(0,0,0,0.6)"};
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.3px;
        }
        .nav-link:hover {
          color: #FF4500;
        }
        .nav-cta {
          font-size: 0.9rem;
          padding: 10px 28px;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: ${isScrolled ? "#1A1A2E" : "#ffffff"};
        }
        .mobile-menu {
          background: #fff;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          animation: slideDown 0.3s ease;
        }
        .mobile-link {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A1A2E;
          text-decoration: none;
        }
        .mobile-link:hover { color: #FF4500; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
        }
      `}</style>
    </>
  );
}
