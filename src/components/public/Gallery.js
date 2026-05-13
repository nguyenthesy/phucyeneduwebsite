"use client";
import { useState, useEffect } from "react";
import { subscribeToCollection } from "@/lib/firestore";
import { HiPlus } from "react-icons/hi";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const unsub = subscribeToCollection("gallery", (data) => {
      // Lấy tối đa 8 ảnh mới nhất
      setImages(data.slice(0, 8));
    }, "createdAt", "desc");
    return unsub;
  }, []);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">HÌNH ẢNH HOẠT ĐỘNG</span>
          <h2>Khoảnh Khắc Tại Phúc Yên Edu</h2>
          <p>Ghi lại những giây phút học tập và vui chơi đầy thú vị của các em học sinh</p>
        </div>

        <div className="gallery-grid">
          {images.map((img, index) => (
            <div key={img.id} className="gallery-item">
              <img src={img.url} alt={`Gallery ${index}`} />
              <div className="gallery-overlay">
                <HiPlus />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gallery-section { padding: 100px 0; background: white; }
        .section-header { text-align: center; margin-bottom: 50px; }
        .subtitle { color: #FF4500; font-weight: 700; letter-spacing: 2px; }
        .section-header h2 { font-size: 2.5rem; font-weight: 800; margin: 10px 0; color: #1A1A2E; }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .gallery-item {
          position: relative;
          height: 250px;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
        }
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 69, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .gallery-item:hover img { transform: scale(1.1); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }

        @media (max-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .gallery-item { height: 200px; }
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
