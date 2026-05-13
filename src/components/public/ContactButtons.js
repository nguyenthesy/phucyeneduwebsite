"use client";
import { useState, useEffect } from "react";
import { getDocument } from "@/lib/firestore";
import { HiPhone } from "react-icons/hi";

export default function ContactButtons() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getDocument("settings", "general").then(setSettings);
  }, []);

  return (
    <div className="contact-floats">
      {/* Hotline Button */}
      <a href={`tel:${settings?.phone || "0846569896"}`} className="float-btn phone-btn" title="Gọi ngay">
        <HiPhone />
        <span className="btn-label">{settings?.phone || "084.656.9896"}</span>
      </a>

      {/* Zalo Button */}
      {settings?.zaloUrl && (
        <a href={settings.zaloUrl} target="_blank" className="float-btn zalo-btn" title="Chat Zalo">
          <div className="z-icon">Z</div>
        </a>
      )}

      <style jsx>{`
        .contact-floats {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
        }
        .float-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: white;
          padding: 12px;
          border-radius: 50px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          transition: 0.3s;
          position: relative;
        }
        .phone-btn {
          background: #FF4500;
          padding-left: 20px;
          flex-direction: row-reverse;
          animation: pulse 2s infinite;
        }
        .zalo-btn {
          background: #0068FF;
          width: 50px;
          height: 50px;
          justify-content: center;
          padding: 0;
        }
        .z-icon { font-weight: 900; font-size: 1.4rem; }
        .btn-label { font-weight: 700; font-size: 0.9rem; }
        
        .float-btn:hover {
          transform: scale(1.1) translateX(-10px);
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 69, 0, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(255, 69, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 69, 0, 0); }
        }

        @media (max-width: 768px) {
          .contact-floats { bottom: 20px; right: 20px; }
          .btn-label { display: none; }
          .phone-btn { padding: 12px; width: 50px; height: 50px; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
