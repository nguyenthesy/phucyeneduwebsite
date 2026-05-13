"use client";
import { useState, useEffect } from "react";
import { subscribeToCollection } from "@/lib/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { HiStar } from "react-icons/hi";
import { FaQuoteRight } from "react-icons/fa";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const unsub = subscribeToCollection("testimonials", (data) => {
      // Chỉ lấy các đánh giá đang hoạt động (isActive = true)
      setTestimonials(data.filter(t => t.isActive));
    }, "order", "asc");
    return unsub;
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-title">
          <h2>Học Sinh và Phụ Huynh <span className="highlight">Nói Gì?</span></h2>
          <div className="underline"></div>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="testimonial-card">
                <div className="quote-icon">
                  <FaQuoteRight />
                </div>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={i < item.rating ? "star-active" : "star-inactive"} />
                  ))}
                </div>
                <p className="content">{item.content}</p>
                <div className="user-info">
                  <div className="user-img">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="placeholder">👤</div>}
                  </div>
                  <div className="user-details">
                    <h4>{item.name}</h4>
                    <span>{item.role}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .testimonials {
          padding: 100px 0;
          background: linear-gradient(to bottom, #ffffff, #fdf4f0);
        }
        .section-title {
          text-align: center;
          margin-bottom: 60px;
        }
        .section-title h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1A1A2E;
        }
        .highlight {
          color: #FF4500;
        }
        .underline {
          width: 80px;
          height: 4px;
          background: #FF4500;
          margin: 15px auto;
          border-radius: 2px;
        }
        .testimonial-swiper {
          padding: 20px 10px 60px !important;
        }
        .testimonial-card {
          background: white;
          padding: 40px 30px;
          border-radius: 30px;
          box-shadow: 0 10px 30px rgba(255, 69, 0, 0.05);
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid #f0f0f0;
          transition: transform 0.3s;
        }
        .testimonial-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(255, 69, 0, 0.1);
        }
        .quote-icon {
          position: absolute;
          top: 30px;
          right: 30px;
          font-size: 2.5rem;
          color: rgba(255, 69, 0, 0.1);
        }
        .stars {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }
        :global(.star-active) { color: #FFD700; }
        :global(.star-inactive) { color: #eee; }
        .content {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #444;
          margin-bottom: 30px;
          font-style: italic;
          flex: 1;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .user-img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          overflow: hidden;
          background: #f0f0f0;
        }
        .user-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; color: #999;
        }
        .user-details h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A1A2E;
          margin-bottom: 2px;
        }
        .user-details span {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .section-title h2 { font-size: 2rem; }
          .testimonial-card { padding: 30px 20px; }
        }
      `}</style>
    </section>
  );
}
