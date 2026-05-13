"use client";
import { useState, useEffect } from "react";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import Stats from "@/components/public/Stats";
import Courses from "@/components/public/Courses";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import Testimonials from "@/components/public/Testimonials";
import News from "@/components/public/News";
import Gallery from "@/components/public/Gallery";
import { HiPhone, HiMail, HiLocationMarker, HiCheckCircle } from "react-icons/hi";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { addDocument, getDocument, subscribeToCollection } from "@/lib/firestore";
import toast from "react-hot-toast";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", phone: "", course: "", note: "" });
  const [settings, setSettings] = useState(null);
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 1. Lấy cài đặt chung
    getDocument("settings", "general").then(setSettings);

    // 2. Lấy danh sách khóa học để đưa vào Form
    const unsub = subscribeToCollection("courses", (data) => {
      setCourses(data.filter(c => c.isActive));
    }, "order", "asc");
    
    return unsub;
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ họ tên và số điện thoại!");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Lưu vào Firestore
      await addDocument("contacts", {
        ...formData,
        isRead: false,
        source: "homepage_form",
      });

      // 2. Gửi Telegram
      await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.");
      setFormData({ name: "", phone: "", course: "", note: "" });
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <Courses />
      <WhyChooseUs />
      <Testimonials />
      <News />
      <Gallery />

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-card glass">
            {/* Left: Info */}
            <div className="contact-info">
              <span className="contact-label">LIÊN HỆ VỚI CHÚNG TÔI</span>
              <h2>Bạn Cần Tư Vấn Thêm?</h2>
              <p>Để lại thông tin, đội ngũ chuyên gia của chúng tôi sẽ liên hệ lại ngay trong vòng 30 phút.</p>
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon"><HiPhone /></div>
                  <div>
                    <span className="info-label">Hotline</span>
                    <span className="info-value">{settings?.phone || "0846569896 - 0868308666"}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><HiMail /></div>
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{settings?.email || "phucyen.edu@gmail.com"}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><HiLocationMarker /></div>
                  <div>
                    <span className="info-label">Địa chỉ</span>
                    <span className="info-value">{settings?.address || " 135 Trưng Nhị, Phường Phúc Yên, Tỉnh Phú Thọ"}</span>
                  </div>
                </div>
              </div>
              <div className="social-links">
                {settings?.facebookUrl && <a href={settings.facebookUrl} className="social-icon" aria-label="Facebook"><FaFacebook /></a>}
                {settings?.youtubeUrl && <a href={settings.youtubeUrl} className="social-icon" aria-label="Youtube"><FaYoutube /></a>}
                {settings?.zaloUrl && <a href={settings.zaloUrl} className="social-icon zalo-btn" aria-label="Zalo">Z</a>}
              </div>
            </div>

            {/* Right: Form */}
            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="success-state">
                  <div className="success-icon"><HiCheckCircle /></div>
                  <h3>Đăng Ký Thành Công!</h3>
                  <p>Cảm ơn bạn đã quan tâm. Tư vấn viên sẽ liên hệ lại trong vòng 30 phút.</p>
                  <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Đăng ký thêm</button>
                </div>
              ) : (
                <>
                  <h3 className="form-title">Đăng Ký Tư Vấn Miễn Phí</h3>
                  <p className="form-subtitle">Nhận ngay ưu đãi học phí lên đến 50%</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Họ và tên *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0xxx xxx xxx"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Khóa học quan tâm</label>
                      <select name="course" value={formData.course} onChange={handleChange}>
                        <option value="">-- Chọn khóa học --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ghi chú thêm</label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Thời gian học mong muốn, câu hỏi..."
                        rows="3"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
                      {submitting ? "Đang gửi..." : "GỬI YÊU CẦU NGAY 🚀"}
                    </button>
                    <p className="form-note">🔒 Thông tin của bạn được bảo mật hoàn toàn</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <span className="bold">{settings?.centerName?.split(' ')[0] || "PHÚC YÊN"}</span> {settings?.centerName?.split(' ').slice(1).join(' ') || "EDU"}
              </div>
              <p>Hệ thống Anh ngữ hàng đầu tại Vĩnh Phúc, cam kết mang lại chất lượng giáo dục chuẩn quốc tế.</p>
            </div>
            <div className="footer-col">
              <h4>Liên Kết</h4>
              <ul>
                <li><a href="#">Về chúng tôi</a></li>
                <li><a href="#courses">Khóa học</a></li>
                <li><a href="#news">Tin tức</a></li>
                <li><a href="#contact">Liên hệ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Hỗ Trợ</h4>
              <ul>
                <li><a href="#">Chính sách bảo mật</a></li>
                <li><a href="#">Điều khoản sử dụng</a></li>
                <li><a href="#">Câu hỏi thường gặp</a></li>
                <li><a href="/admin/login">Quản trị viên</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Anh Ngữ Phúc Yên Edu. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* ---- Contact Section ---- */
        .contact-section {
          background: linear-gradient(rgba(20, 20, 40, 0.85), rgba(20, 20, 40, 0.85)),
            url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1500&q=80') center/cover;
          padding: 100px 0;
        }
        .contact-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          padding: 60px;
          border-radius: 30px;
          color: white;
        }
        .contact-label {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #FFB347;
          display: block;
          margin-bottom: 12px;
        }
        .contact-info h2 {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 15px;
          line-height: 1.2;
        }
        .contact-info > p {
          font-size: 1.05rem;
          opacity: 0.85;
          margin-bottom: 40px;
        }
        .info-items { display: flex; flex-direction: column; gap: 22px; margin-bottom: 40px; }
        .info-item { display: flex; align-items: flex-start; gap: 18px; }
        .info-icon {
          width: 44px; height: 44px;
          background: rgba(255,69,0,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; color: #FF4500;
          flex-shrink: 0;
        }
        .info-label { display: block; font-size: 0.8rem; opacity: 0.7; margin-bottom: 2px; }
        .info-value { display: block; font-weight: 600; font-size: 1rem; }
        .social-links { display: flex; gap: 14px; }
        .social-icon {
          width: 46px; height: 46px;
          background: rgba(255,255,255,0.12);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; color: white;
          transition: all 0.3s; font-weight: 700;
        }
        .social-icon:hover { background: #FF4500; transform: translateY(-4px); }
        .zalo-btn { font-size: 1rem; }

        /* ---- Form ---- */
        .contact-form-wrapper {
          background: white;
          padding: 45px 40px;
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          color: var(--dark);
        }
        .form-title { font-size: 1.8rem; font-weight: 800; color: #1A1A2E; margin-bottom: 6px; }
        .form-subtitle { color: #FF4500; font-weight: 600; margin-bottom: 30px; }
        .form-group { margin-bottom: 18px; }
        .form-group label {
          display: block; font-size: 0.9rem; font-weight: 600;
          color: #2D3436; margin-bottom: 6px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%; padding: 13px 16px;
          border: 2px solid #eee; border-radius: 10px;
          font-family: inherit; font-size: 1rem;
          color: #2D3436; background: #f9f9f9;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none; border-color: #FF4500; background: white;
        }
        .btn-submit {
          width: 100%; padding: 16px;
          font-size: 1.1rem; letter-spacing: 0.5px;
          margin-top: 8px;
        }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .form-note { text-align: center; font-size: 0.82rem; color: #999; margin-top: 12px; }

        /* Success state */
        .success-state {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; gap: 16px;
          padding: 40px 0;
        }
        .success-icon { font-size: 5rem; color: #00C851; }
        .success-state h3 { font-size: 1.8rem; font-weight: 800; }
        .success-state p { color: #636e72; font-size: 1.05rem; }

        /* ---- Footer ---- */
        .footer { background: #0F0F1E; color: white; padding: 80px 0 30px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
        .footer-logo { font-size: 1.8rem; font-weight: 400; margin-bottom: 20px; }
        .footer-logo .bold { font-weight: 800; color: #FF4500; }
        .footer-col > p { opacity: 0.6; line-height: 1.9; font-size: 0.95rem; }
        .footer-col h4 {
          font-size: 1.1rem; font-weight: 700;
          margin-bottom: 28px; position: relative; padding-bottom: 12px;
        }
        .footer-col h4::after {
          content: ''; position: absolute;
          left: 0; bottom: 0; width: 36px; height: 3px;
          background: #FF4500; border-radius: 2px;
        }
        .footer-col ul { display: flex; flex-direction: column; gap: 12px; }
        .footer-col ul li a { opacity: 0.65; font-size: 0.95rem; transition: all 0.2s; }
        .footer-col ul li a:hover { opacity: 1; color: #FF4500; padding-left: 6px; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 28px; text-align: center;
          opacity: 0.45; font-size: 0.88rem;
        }
        @media (max-width: 992px) {
          .contact-card { grid-template-columns: 1fr; padding: 35px; gap: 40px; }
          .contact-info h2 { font-size: 2.2rem; }
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </main>
  );
}
