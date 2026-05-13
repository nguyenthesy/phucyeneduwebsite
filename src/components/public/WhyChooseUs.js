"use client";
import { HiCheck, HiAcademicCap, HiLightBulb, HiChartBar, HiShieldCheck } from "react-icons/hi";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <HiAcademicCap />,
      title: "Lấy lại căn bản thần tốc",
      desc: "Lộ trình thiết kế riêng giúp trẻ mất gốc nắm vững kiến thức nền tảng chỉ sau 3 tháng."
    },
    {
      icon: <HiLightBulb />,
      title: "Phương pháp tư duy chuẩn Mỹ",
      desc: "Kích thích khả năng sáng tạo và phản xạ tiếng Anh tự nhiên như người bản xứ."
    },
    {
      icon: <HiShieldCheck />,
      title: "Cam kết đầu ra bằng văn bản",
      desc: "Chúng tôi luôn đồng hành và cam kết kết quả học tập thực tế cho từng học viên."
    },
    {
      icon: <HiChartBar />,
      title: "Môi trường học tập hiện đại",
      desc: "Cơ sở vật chất đạt chuẩn, trang thiết bị hỗ trợ học tập tương tác thông minh."
    }
  ];

  return (
    <section id="about" className="why-us">
      <div className="container">
        <div className="why-grid">
          <div className="why-image">
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Học sinh Phúc Yên Edu" />
            <div className="experience-badge">
              <span className="number">10+</span>
              <span className="text">Năm kinh nghiệm</span>
            </div>
          </div>
          
          <div className="why-content">
            <span className="sub-title">VỀ CHÚNG TÔI</span>
            <h2>Tại Sao Nên Chọn <br /> <span className="highlight">Phúc Yên Edu?</span></h2>
            <p className="main-desc">
              Chúng tôi không chỉ dạy tiếng Anh, chúng tôi truyền cảm hứng và giúp các em tự tin bước ra thế giới. 
              Với đội ngũ giáo viên tận tâm và phương pháp đào tạo hiện đại, Phúc Yên Edu tự hào là địa chỉ tin cậy của hàng nghìn phụ huynh.
            </p>
            
            <div className="reasons-list">
              {reasons.map((item, index) => (
                <div key={index} className="reason-item">
                  <div className="reason-icon">{item.icon}</div>
                  <div className="reason-text">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .why-us { padding: 100px 0; background: #fff; overflow: hidden; }
        .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        
        .why-image { position: relative; }
        .why-image img { width: 100%; border-radius: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .experience-badge {
          position: absolute; bottom: -30px; right: -30px;
          background: #FF4500; color: white; padding: 25px;
          border-radius: 20px; text-align: center;
          box-shadow: 0 15px 35px rgba(255, 69, 0, 0.3);
          animation: float 3s ease-in-out infinite;
        }
        .experience-badge .number { display: block; font-size: 2.2rem; font-weight: 800; line-height: 1; }
        .experience-badge .text { font-size: 0.85rem; font-weight: 600; opacity: 0.9; }

        .sub-title { color: #FF4500; font-weight: 700; letter-spacing: 2px; }
        .why-content h2 { font-size: 2.8rem; font-weight: 800; margin: 15px 0 25px; line-height: 1.2; color: #1A1A2E; }
        .highlight { color: #FF4500; }
        .main-desc { color: #666; line-height: 1.8; margin-bottom: 40px; font-size: 1.1rem; }
        
        .reasons-list { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .reason-item { display: flex; gap: 15px; }
        .reason-icon {
          width: 50px; height: 50px; background: #fff3e0;
          color: #FF4500; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; flex-shrink: 0;
        }
        .reason-text h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 5px; color: #1A1A2E; }
        .reason-text p { font-size: 0.9rem; color: #777; line-height: 1.5; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 1024px) {
          .why-grid { grid-template-columns: 1fr; gap: 60px; }
          .why-image { max-width: 500px; margin: 0 auto; }
          .experience-badge { right: 0; }
        }
        @media (max-width: 640px) {
          .why-content h2 { font-size: 2rem; }
          .reasons-list { grid-cols-1; grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
