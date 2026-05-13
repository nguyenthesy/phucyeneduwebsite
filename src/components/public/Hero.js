"use client";
import { useState } from "react";
import { HiArrowRight, HiCheckCircle } from "react-icons/hi";
import { addDocument } from "@/lib/firestore";
import toast from "react-hot-toast";

export default function Hero() {
  const [form, setForm] = useState({ name: "", phone: "", course: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    try {
      await addDocument("contacts", { ...form, isRead: false, source: "hero_form" });
      await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setDone(true);
      toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.");
    } catch { toast.error("Có lỗi, vui lòng thử lại!"); }
    finally { setSubmitting(false); }
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className="hero-text max-w-2xl">
          <span className="badge bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
            LỘ TRÌNH CÁ NHÂN HÓA
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Xóa tan nỗi lo mất gốc <br /> 
            <span className="highlight text-blue-600">Làm chủ tiếng Anh tự nhiên</span>
          </h1>

          <div className="description space-y-4 mb-8 text-gray-700 text-lg leading-relaxed">
            <p>
              Tại <strong>Phúc Yên Edu</strong>, chúng tôi không chỉ dạy tiếng Anh – chúng tôi xây dựng 
              <strong> bản lĩnh giao tiếp</strong> và <strong>tư duy toàn diện</strong> cho học sinh Tiểu học & trung học cơ sở.
            </p>
            <ul className="usp-list grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span> Lấy lại căn bản thần tốc cho trẻ mất gốc
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span> Phản xạ tự nhiên - Không ngại sai, không sợ nói
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span> Phương pháp tư duy logic chuẩn quốc tế
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span> Cam kết đồng hành tới khi con thành công
              </li>
            </ul>
          </div>

          <div className="hero-btns flex gap-4">
            <a href="#contact" className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Nhận lộ trình học miễn phí
            </a>
            <button className="btn btn-outline flex items-center gap-2">
              Kết quả học viên <HiArrowRight />
            </button>
          </div>
        </div>
        
        <div className="hero-form glass">
          {done ? (
            <div className="hero-success">
              <HiCheckCircle className="success-icon" />
              <h3>Đăng Ký Thành Công!</h3>
              <p>Tư vấn viên sẽ liên hệ bạn sớm nhất.</p>
              <button className="btn btn-primary w-full" onClick={() => setDone(false)}>Đăng ký thêm</button>
            </div>
          ) : (
            <>
              <h3>Đăng Ký Tư Vấn</h3>
              <p>Nhận ngay bộ quà tặng trị giá 2.000.000đ</p>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Họ và tên của học sinh" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
                <input type="tel" placeholder="Số điện thoại phụ huynh" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} required />
                <select value={form.course} onChange={e => setForm(p => ({...p, course: e.target.value}))}>
                  <option value="">Chọn độ tuổi của bé</option>
                  <option value="3-6 tuổi">3 - 6 tuổi</option>
                  <option value="6-11 tuổi">6 - 11 tuổi</option>
                  <option value="11-15 tuổi">11 - 15 tuổi</option>
                  <option value="Trên 15 tuổi">Trên 15 tuổi</option>
                </select>
                <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                  {submitting ? "Đang gửi..." : "GỬI YÊU CẦU"}
                </button>
              </form>
              <p className="form-note">* Thông tin của bạn được bảo mật tuyệt đối.</p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background-image: url('https://images.unsplash.com/photo-1523240715630-971c46927976?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          padding-top: 100px;
          padding-bottom: 50px;
          color: white;
        }
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(15, 15, 30, 0.95) 0%, rgba(255, 69, 0, 0.3) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
        }
        .hero-text { max-width: 800px; }
        .badge {
          background: #fff3e0;
          color: #FF4500;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 24px;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(255,69,0,0.2);
        }
        .hero-text h1 {
          font-size: 3.8rem;
          line-height: 1.15;
          font-weight: 800;
          margin-bottom: 28px;
          text-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .highlight { color: #FF4500; }
        .description { font-size: 1.15rem; color: rgba(255,255,255,0.9); margin-bottom: 40px; line-height: 1.7; }
        .usp-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 25px;
          list-style: none;
          padding: 0;
        }
        .usp-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .usp-list li span { color: #00FF88; font-weight: 900; }
        
        .hero-btns { display: flex; gap: 20px; }
        .btn-lg { padding: 16px 36px; font-size: 1.05rem; font-weight: 700; border-radius: 14px; }
        .btn-outline {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 14px 30px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          backdrop-filter: blur(5px);
          transition: all 0.3s;
        }
        .btn-outline:hover { background: white; color: #1A1A2E; border-color: white; }

        .hero-form {
          padding: 45px 35px;
          border-radius: 30px;
          color: #1A1A2E;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }
        .hero-form h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; color: #1A1A2E; }
        .hero-form p { margin-bottom: 28px; font-weight: 600; color: #FF4500; }
        
        form { display: flex; flex-direction: column; gap: 16px; }
        input, select {
          padding: 14px 20px;
          border-radius: 12px;
          border: 2px solid #eee;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.2s;
        }
        input:focus, select:focus { border-color: #FF4500; outline: none; background: white; }
        .w-full { width: 100%; }
        .form-note { font-size: 0.75rem; margin-top: 15px; opacity: 0.6; }

        .hero-success { padding: 40px 0; }
        .success-icon { font-size: 4rem; color: #00C851; margin-bottom: 15px; }

        @media (max-width: 1024px) {
          .hero-content { grid-template-columns: 1fr; gap: 50px; text-align: center; }
          .hero-text { max-width: 100%; }
          .hero-text h1 { font-size: 3rem; }
          .description { margin-left: auto; margin-right: auto; }
          .usp-list { justify-content: center; }
          .hero-btns { justify-content: center; }
        }

        @media (max-width: 640px) {
          .hero { padding-top: 120px; }
          .hero-text h1 { font-size: 2.2rem; }
          .usp-list { grid-template-columns: 1fr; text-align: left; max-width: 300px; margin-left: auto; margin-right: auto; }
          .hero-btns { flex-direction: column; }
          .hero-form { padding: 35px 20px; }
        }
      `}</style>
    </section>
  );
}
