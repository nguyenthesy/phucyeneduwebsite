"use client";
import { useState, useEffect } from "react";
import { getDocument } from "@/lib/firestore";
import { HiUserGroup, HiAcademicCap, HiStar, HiOfficeBuilding } from "react-icons/hi";

export default function Stats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDocument("settings", "general").then(setData);
  }, []);

  const stats = [
    { icon: <HiUserGroup />, count: data?.statStudents || "10,000+", label: "Học viên tin tưởng" },
    { icon: <HiAcademicCap />, count: data?.statTeachers || "150+", label: "Giáo viên chuyên môn" },
    { icon: <HiStar />, count: data?.statYears || "10+", label: "Năm kinh nghiệm" },
    { icon: <HiOfficeBuilding />, count: data?.statBranches || "5+", label: "Cơ sở hiện đại" },
  ];

  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.count}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats {
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
          padding: 40px 0;
          color: white;
          margin-top: -50px;
          z-index: 5;
          position: relative;
          border-radius: 20px;
          margin-left: 20px;
          margin-right: 20px;
          box-shadow: 0 15px 35px rgba(255, 69, 0, 0.3);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 20px;
          justify-content: center;
        }
        .stat-icon {
          font-size: 2.8rem;
          opacity: 0.9;
        }
        .stat-info h3 {
          font-size: 1.8rem;
          font-weight: 800;
          line-height: 1;
        }
        .stat-info p {
          font-size: 0.85rem;
          font-weight: 500;
          opacity: 0.9;
          margin-top: 4px;
        }
        @media (max-width: 992px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
        }
        @media (max-width: 576px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
