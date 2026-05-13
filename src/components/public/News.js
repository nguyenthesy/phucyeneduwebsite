"use client";
import { useState, useEffect } from "react";
import { subscribeToCollection } from "@/lib/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const unsub = subscribeToCollection("news", (data) => {
      // Chỉ lấy các bài đã đăng (isPublished = true)
      setNews(data.filter(item => item.isPublished));
    }, "createdAt", "desc");
    return unsub;
  }, []);

  if (news.length === 0) return null;

  return (
    <section id="news" className="news-section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">TIN TỨC & SỰ KIỆN</span>
          <h2>Cập Nhật Mới Nhất</h2>
          <p>Những hoạt động nổi bật và kiến thức bổ ích cho học sinh</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="news-swiper"
        >
          {news.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="news-card">
                <div className="news-img">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} />
                  ) : (
                    <div className="placeholder-img">📰</div>
                  )}
                </div>
                <div className="news-content">
                  <span className="date">
                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString("vi-VN") : ""}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <Link href={`/news/${item.id}`} className="read-more">Xem chi tiết →</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .news-section { padding: 100px 0; background: #f8f9fa; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .subtitle { color: var(--primary); font-weight: 700; letter-spacing: 2px; }
        .section-header h2 { font-size: 2.5rem; font-weight: 800; margin: 10px 0; color: var(--dark); }
        
        .news-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          height: 100%;
          transition: transform 0.3s;
        }
        .news-card:hover { transform: translateY(-10px); }
        .news-img { height: 220px; background: #eee; }
        .news-img img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        
        .news-content { padding: 25px; }
        .date { font-size: 0.85rem; color: #999; font-weight: 600; }
        .news-content h3 { font-size: 1.25rem; font-weight: 700; margin: 12px 0; line-height: 1.4; color: var(--dark); }
        .news-content p { color: #666; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.6; }
        .read-more { background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; padding: 0; }
      `}</style>
    </section>
  );
}
