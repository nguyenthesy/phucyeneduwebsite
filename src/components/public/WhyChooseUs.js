"use client";
import { HiCheckCircle, HiLightBulb, HiShieldCheck, HiOutlineStatusOnline } from "react-icons/hi";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <HiCheckCircle />,
      title: "Chất Lượng Quốc Tế",
      desc: "Giáo trình được cập nhật liên tục từ các nhà xuất bản uy tín thế giới như Oxford, Cambridge."
    },
    {
      icon: <HiLightBulb />,
      title: "Phương Pháp Hiện Đại",
      desc: "Học thông qua dự án, giúp học sinh chủ động sáng tạo và phát triển tư duy toàn diện."
    },
    {
      icon: <HiShieldCheck />,
      title: "Cam Kết Đầu Ra",
      desc: "Cam kết bằng văn bản về lộ trình học tập và kết quả đạt được sau mỗi khóa học."
    },
    {
      icon: <HiOutlineStatusOnline />,
      title: "Công Nghệ 4.0",
      desc: "Hệ thống quản lý học tập trực tuyến giúp phụ huynh dễ dàng theo dõi tiến độ của con."
    }
  ];

  return (
    <section id="about" className="why-choose-us">
      <div className="container">
        <div className="grid-2">
          <div className="why-image">
            <div className="image-wrapper">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Why choose us" />
              <div className="experience-badge">
                <span className="number">10+</span>
                <span className="text">Năm Kinh Nghiệm</span>
              </div>
            </div>
          </div>
          
          <div className="why-content">
            <span className="sub-title">VỀ CHÚNG TÔI</span>
            <h2>Tại Sao Nên Chọn <br /> <span className="highlight">Phúc Yên Edu?</span></h2>
            <p className="main-desc">
              Chúng tôi không chỉ dạy tiếng Anh, chúng tôi truyền cảm hứng và giúp các em tự tin bước ra thế giới. 
              Với đội ngũ giáo viên tận tâm và cơ sở vật chất hiện đại, chúng tôi tự hào là địa chỉ tin cậy của hàng nghìn phụ huynh.
            </p>
            
            <div className="reasons-grid">
              {reasons.map((reason, index) => (
                <div key={index} className="reason-item">
                  <div className="reason-icon">{reason.icon}</div>
                  <div className="reason-text">
                    <h4>{reason.title}</h4>
                    <p>{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .why-image .image-wrapper {
          position: relative;
          padding-right: 30px;
          padding-bottom: 30px;
        }
        .why-image img {
          width: 100%;
          border-radius: 20px;
          box-shadow: var(--shadow);
        }
        .experience-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--primary);
          color: white;
          padding: 30px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 10px 30px rgba(255, 69, 0, 0.4);
        }
        .experience-badge .number {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
        }
        .experience-badge .text {
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 5px;
        }
        .sub-title {
          color: var(--primary);
          font-weight: 700;
          letter-spacing: 2px;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 15px;
        }
        h2 {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 25px;
          line-height: 1.2;
        }
        .highlight { color: var(--primary); }
        .main-desc {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-bottom: 40px;
        }
        .reasons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .reason-item {
          display: flex;
          gap: 15px;
        }
        .reason-icon {
          color: var(--primary);
          font-size: 1.8rem;
          margin-top: 3px;
        }
        .reason-text h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .reason-text p {
          font-size: 0.9rem;
          color: var(--text-light);
          line-height: 1.5;
        }
        @media (max-width: 992px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
          .why-content {
            order: -1;
          }
          h2 { font-size: 2.2rem; }
        }
        @media (max-width: 576px) {
          .reasons-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
