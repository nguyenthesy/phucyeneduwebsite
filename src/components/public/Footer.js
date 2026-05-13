"use client";
import { useState, useEffect } from "react";
import { getDocument } from "@/lib/firestore";
import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getDocument("settings", "general").then(setSettings);
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Cột 1: Thông tin trung tâm */}
          <div className="footer-col">
            <div className="footer-logo">
              <span className="bold">{settings?.centerName?.split(' ')[0] || "PHÚC YÊN"}</span> {settings?.centerName?.split(' ').slice(1).join(' ') || "EDU"}
            </div>
            <p>Hệ thống Anh ngữ hàng đầu tại Vĩnh Phúc, cam kết mang lại chất lượng giáo dục chuẩn quốc tế.</p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="footer-col">
            <h4>Liên Kết</h4>
            <ul>
              <li><Link href="/">Trang chủ</Link></li>
              <li><Link href="/#about">Về chúng tôi</Link></li>
              <li><Link href="/#courses">Khóa học</Link></li>
              <li><Link href="/#news">Tin tức</Link></li>
              <li><Link href="/#contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="footer-col">
            <h4>Hỗ Trợ</h4>
            <ul>
              <li><Link href="#">Chính sách bảo mật</Link></li>
              <li><Link href="#">Điều khoản sử dụng</Link></li>
              <li><Link href="#">Câu hỏi thường gặp</Link></li>
              <li><Link href="/admin/login">Quản trị viên</Link></li>
            </ul>
          </div>

          {/* Cột 4: Kết nối */}
          <div className="footer-col">
            <h4>Liên Hệ</h4>
            <ul className="footer-contact">
              <li><HiPhone /> {settings?.phone || "0846569896"}</li>
              <li><HiMail /> {settings?.email || "phucyen.edu@gmail.com"}</li>
              <li><HiLocationMarker /> {settings?.address || "135 Trưng Nhị, Phúc Yên"}</li>
            </ul>
            <div className="social-links mt-4">
              {settings?.facebookUrl && <a href={settings.facebookUrl} className="social-icon"><FaFacebook /></a>}
              {settings?.youtubeUrl && <a href={settings.youtubeUrl} className="social-icon"><FaYoutube /></a>}
              {settings?.zaloUrl && <a href={settings.zaloUrl} className="social-icon zalo-btn">Z</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Anh Ngữ Phúc Yên Edu. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer { background: #0F0F1E; color: white; padding: 80px 0 30px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 40px; margin-bottom: 50px; }
        .footer-logo { font-size: 1.8rem; font-weight: 400; margin-bottom: 20px; color: #FF4500; }
        .footer-logo .bold { font-weight: 800; color: white; }
        .footer-col p { color: #aaa; line-height: 1.6; font-size: 0.95rem; }
        .footer-col h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 25px; position: relative; padding-bottom: 10px; }
        .footer-col h4::after { content: ''; position: absolute; bottom: 0; left: 0; width: 30px; height: 3px; background: #FF4500; }
        .footer-col ul { list-style: none; padding: 0; }
        .footer-col ul li { margin-bottom: 12px; }
        .footer-col ul li :global(a) { color: #aaa; text-decoration: none; transition: 0.3s; font-size: 0.95rem; }
        .footer-col ul li :global(a):hover { color: #FF4500; padding-left: 5px; }
        .footer-contact li { display: flex; align-items: center; gap: 10px; color: #aaa; margin-bottom: 12px; font-size: 0.95rem; }
        .footer-contact li :global(svg) { color: #FF4500; font-size: 1.2rem; }
        
        .social-links { display: flex; gap: 12px; margin-top: 20px; }
        .social-icon { 
          width: 40px; height: 40px; background: rgba(255,255,255,0.1); 
          display: flex; align-items: center; justify-content: center; 
          border-radius: 50%; color: white; text-decoration: none; transition: 0.3s; 
        }
        .social-icon:hover { background: #FF4500; transform: translateY(-5px); }
        .zalo-btn { font-weight: 800; font-size: 1.1rem; }
        
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 30px; text-align: center; color: #666; font-size: 0.9rem; }
        
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
