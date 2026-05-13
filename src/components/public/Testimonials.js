"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { HiStar } from "react-icons/hi";

export default function Testimonials() {
  const reviews = [
    {
      name: "Nguyễn Minh Anh",
      role: "Phụ huynh bé Bi (5 tuổi)",
      content: "Từ khi học tại Phúc Yên Edu, bé nhà mình tự tin hơn hẳn. Bé rất thích đi học vì các thầy cô giáo rất vui tính và bài học sinh động.",
      image: "https://i.pravatar.cc/150?u=1",
      rating: 5
    },
    {
      name: "Trần Đức Nam",
      role: "Học sinh lớp IELTS 7.5",
      content: "Môi trường học tập chuyên nghiệp, lộ trình rõ ràng. Mình đã đạt mục tiêu 7.5 IELTS chỉ sau 6 tháng ôn luyện tại đây.",
      image: "https://i.pravatar.cc/150?u=2",
      rating: 5
    },
    {
      name: "Lê Thu Trang",
      role: "Phụ huynh bé Bông (8 tuổi)",
      content: "Chương trình học chuẩn Cambridge giúp con nắm vững kiến thức nền tảng. Phụ huynh cũng dễ dàng theo dõi bài vở của con qua ứng dụng.",
      image: "https://i.pravatar.cc/150?u=3",
      rating: 5
    }
  ];

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
          autoplay={{ delay: 5000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="testimonial-swiper"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <div className="rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <HiStar key={i} className="star-icon" />
                  ))}
                </div>
                <p className="content">"{review.content}"</p>
                <div className="user-info">
                  <img src={review.image} alt={review.name} />
                  <div>
                    <h4>{review.name}</h4>
                    <span>{review.role}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .testimonials { padding-bottom: 100px; }
        .highlight { color: var(--primary); }
        .testimonial-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: var(--shadow);
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid #eee;
        }
        .rating {
          color: #FFB347;
          display: flex;
          gap: 2px;
          margin-bottom: 20px;
        }
        .content {
          font-style: italic;
          color: var(--text-dark);
          font-size: 1.1rem;
          margin-bottom: 30px;
          flex-grow: 1;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .user-info img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .user-info span {
          font-size: 0.85rem;
          color: var(--text-light);
        }
        :global(.swiper-pagination-bullet-active) {
          background: var(--primary) !important;
        }
      `}</style>
    </section>
  );
}
