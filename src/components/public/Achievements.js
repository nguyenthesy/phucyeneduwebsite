"use client";
import { useState, useEffect } from "react";
import { subscribeToCollection } from "@/lib/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { HiOutlineZoomIn, HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    // Sử dụng subscribeToCollection để lấy toàn bộ dữ liệu sắp xếp theo order,
    // sau đó lọc các mục isActive === true trên client để tránh lỗi thiếu Composite Index trong Firestore.
    const unsub = subscribeToCollection("achievements", (data) => {
      const activeItems = data.filter(item => item.isActive);
      setAchievements(activeItems);
    }, "order", "asc");
    return unsub;
  }, []);

  if (achievements.length === 0) return null;

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden"; // khóa cuộn màn hình
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = ""; // mở lại cuộn màn hình
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? achievements.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === achievements.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="achievements" className="achievements-section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">BẢNG VÀNG VINH DANH</span>
          <h2>Thành Tích Học Sinh Xuất Sắc</h2>
          <p>
            Phúc Yên Edu vô cùng tự hào được đồng hành và chắp cánh ước mơ cho các thế hệ học sinh gặt hái những kết quả vượt trội!
          </p>
        </div>

        <div className="swiper-container-wrapper">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
            className="achievements-swiper"
          >
            {achievements.map((item, index) => (
              <SwiperSlide key={item.id}>
                <div className="achievement-card" onClick={() => openLightbox(index)}>
                  <div className="card-inner">
                    <img src={item.imageUrl} alt={item.caption || "Thành tích học sinh"} loading="lazy" />
                    <div className="card-overlay">
                      <div className="zoom-icon">
                        <HiOutlineZoomIn />
                      </div>
                      <p className="achievement-caption">{item.caption}</p>
                    </div>
                  </div>
                  <div className="shine-effect"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Đóng"><HiX /></button>
          
          <button className="lightbox-nav prev" onClick={prevImage} aria-label="Ảnh trước"><HiChevronLeft /></button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={achievements[lightboxIndex].imageUrl} 
              alt={achievements[lightboxIndex].caption || "Thành tích học sinh phóng to"} 
            />
            {achievements[lightboxIndex].caption && (
              <div className="lightbox-caption">{achievements[lightboxIndex].caption}</div>
            )}
          </div>
          
          <button className="lightbox-nav next" onClick={nextImage} aria-label="Ảnh tiếp"><HiChevronRight /></button>
        </div>
      )}

      <style jsx>{`
        .achievements-section {
          padding: 100px 0;
          background: linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%);
          position: relative;
          overflow: hidden;
        }
        .achievements-section::before {
          content: "";
          position: absolute;
          top: -20%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 69, 0, 0.05) 0%, transparent 70%);
          z-index: 1;
          pointer-events: none;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }
        .section-header {
          text-align: center;
          margin-bottom: 60px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .subtitle {
          color: #FF4500;
          font-weight: 800;
          letter-spacing: 3px;
          font-size: 0.85rem;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
        }
        .section-header h2 {
          font-size: 2.6rem;
          font-weight: 800;
          color: #1A1A2E;
          margin-bottom: 16px;
          line-height: 1.25;
        }
        .section-header p {
          color: #636e72;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .swiper-container-wrapper {
          position: relative;
          padding-bottom: 50px;
        }

        :global(.achievements-swiper) {
          padding: 20px 10px 40px !important;
        }

        .achievement-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          aspect-ratio: 4/5;
          border: 1px solid rgba(0, 0, 0, 0.03);
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .achievement-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(26, 26, 46, 0.9) 0%, rgba(26, 26, 46, 0.3) 60%, rgba(26, 26, 46, 0) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 24px 20px;
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }

        .zoom-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 69, 0, 0.95);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 10px 20px rgba(255, 69, 0, 0.3);
          transform: translateY(20px) scale(0.8);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
          margin-bottom: auto;
          margin-top: auto;
        }

        .achievement-caption {
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          text-align: center;
          margin-top: 10px;
          transform: translateY(10px);
          transition: transform 0.3s ease;
          line-height: 1.4;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Hover effects */
        .achievement-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .achievement-card:hover img {
          transform: scale(1.08);
        }

        .achievement-card:hover .zoom-icon {
          transform: translateY(0) scale(1);
          opacity: 1;
        }

        .achievement-card:hover .achievement-caption {
          transform: translateY(0);
        }

        /* Shine effect */
        .shine-effect {
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%);
          transform: skewX(-25deg);
          transition: 0.75s;
          pointer-events: none;
        }
        .achievement-card:hover .shine-effect {
          left: 150%;
          transition: 0.75s;
        }

        /* Lightbox CSS */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 15, 30, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.25s ease-out;
        }

        .lightbox-close {
          position: absolute;
          top: 25px;
          right: 25px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: white;
          font-size: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .lightbox-close:hover {
          background: #FF4500;
          transform: rotate(90deg);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.06);
          border: none;
          color: white;
          font-size: 2.2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .lightbox-nav:hover {
          background: #FF4500;
          color: white;
        }
        .lightbox-nav.prev { left: 40px; }
        .lightbox-nav.next { right: 40px; }

        .lightbox-content {
          position: relative;
          max-width: 85%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: scaleIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .lightbox-content img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .lightbox-caption {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 20px;
          text-align: center;
          background: rgba(0, 0, 0, 0.6);
          padding: 8px 24px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .section-header h2 { font-size: 2.1rem; }
          .lightbox-nav { width: 46px; height: 46px; font-size: 1.6rem; }
          .lightbox-nav.prev { left: 10px; }
          .lightbox-nav.next { right: 10px; }
          .lightbox-close { top: 15px; right: 15px; width: 40px; height: 40px; font-size: 1.5rem; }
        }
        @media (max-width: 480px) {
          .section-header h2 { font-size: 1.8rem; }
        }
      `}</style>
    </section>
  );
}
