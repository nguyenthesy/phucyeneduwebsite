"use client";
import { useState, useEffect } from "react";
import { subscribeToCollection } from "@/lib/firestore";
import { HiUserGroup, HiClock, HiArrowRight } from "react-icons/hi";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const unsub = subscribeToCollection("courses", (data) => {
      // Chỉ lấy các khóa học đang hoạt động (isActive = true)
      setCourses(data.filter(c => c.isActive));
    }, "order", "asc");
    return unsub;
  }, []);

  if (courses.length === 0) return null;

  return (
    <section id="courses" className="courses-section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">KHÓA HỌC ĐÀO TẠO</span>
          <h2>Chương Trình Học Chuẩn Quốc Tế</h2>
          <p>Lộ trình học tập cá nhân hóa, giúp học viên phát triển toàn diện kỹ năng nghe, nói, đọc, viết.</p>
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} />
                ) : (
                  <div className="placeholder-img">📚</div>
                )}
                <div className="course-tag">{course.age || "Mọi độ tuổi"}</div>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p>{course.desc || "Khóa học tiếng Anh chất lượng cao giúp học viên tự tin giao tiếp."}</p>
                <div className="course-meta">
                  <div className="meta-item">
                    <HiUserGroup /> {course.level || "Cơ bản"}
                  </div>
                  <div className="meta-item">
                    <HiClock /> {course.schedule || "Linh hoạt"}
                  </div>
                </div>
                <div className="course-footer">
                  <span className="price">{course.price || "Liên hệ"}</span>
                  <a href="#contact" className="btn-detail">Đăng ký <HiArrowRight /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .courses-section { padding: 100px 0; background: white; }
        .section-header { text-align: center; margin-bottom: 60px; max-width: 700px; margin-left: auto; margin-right: auto; }
        .subtitle { color: var(--primary); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: 0.9rem; }
        .section-header h2 { font-size: 2.5rem; font-weight: 800; margin: 15px 0; color: var(--dark); }
        .section-header p { color: #666; font-size: 1.1rem; }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }
        .course-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          transition: all 0.3s;
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
        }
        .course-card:hover { transform: translateY(-10px); box-shadow: 0 20px 60px rgba(255, 69, 0, 0.15); border-color: var(--primary); }
        
        .course-image { position: relative; height: 240px; background: #f5f5f5; }
        .course-image img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; }
        .course-tag {
          position: absolute; top: 20px; left: 20px;
          background: var(--primary); color: white;
          padding: 6px 15px; border-radius: 50px;
          font-size: 0.8rem; font-weight: 700;
        }

        .course-content { padding: 30px; flex: 1; display: flex; flex-direction: column; }
        .course-content h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 15px; color: var(--dark); }
        .course-content p { color: #777; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; }
        
        .course-meta { display: flex; gap: 20px; margin-bottom: 25px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #666; font-weight: 600; }
        .meta-item :global(svg) { color: var(--primary); font-size: 1.1rem; }

        .course-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .price { font-size: 1.2rem; font-weight: 800; color: var(--primary); }
        .btn-detail {
          display: flex; align-items: center; gap: 8px;
          color: var(--dark); font-weight: 700; font-size: 0.9rem;
          text-decoration: none; transition: all 0.2s;
        }
        .btn-detail:hover { color: var(--primary); gap: 12px; }

        @media (max-width: 768px) {
          .courses-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
