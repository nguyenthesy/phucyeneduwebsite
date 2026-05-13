"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToCollection } from "@/lib/firestore";
import { HiBookOpen, HiNewspaper, HiUsers, HiPhotograph, HiClock, HiCheckCircle } from "react-icons/hi";

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const unsub1 = subscribeToCollection("contacts", setContacts);
    const unsub2 = subscribeToCollection("courses", setCourses);
    const unsub3 = subscribeToCollection("news", setNews);
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const newContacts = contacts.filter(c => !c.isRead);

  const stats = [
    { icon: <HiBookOpen />, label: "Khóa học", value: courses.length, color: "#FF4500", href: "/admin/dashboard/courses" },
    { icon: <HiNewspaper />, label: "Bài tin tức", value: news.length, color: "#0984E3", href: "/admin/dashboard/news" },
    { icon: <HiUsers />, label: "Đăng ký mới", value: newContacts.length, color: "#00B894", href: "/admin/dashboard/contacts" },
    { icon: <HiPhotograph />, label: "Tổng đăng ký", value: contacts.length, color: "#6C5CE7", href: "/admin/dashboard/contacts" },
  ];

  return (
    <div>
      <div className="dash-header">
        <h1>Xin chào, Admin! 👋</h1>
        <p>Đây là tổng quan hoạt động của website Phúc Yên Edu</p>
      </div>

      {/* Stats cards */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <Link key={i} href={s.href} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent contacts */}
      <div className="section-card">
        <div className="section-head">
          <h2>Đăng ký gần đây</h2>
          <Link href="/admin/dashboard/contacts" className="view-all">Xem tất cả →</Link>
        </div>
        {contacts.length === 0 ? (
          <div className="empty-state">Chưa có đăng ký nào</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Điện thoại</th>
                <th>Khóa học</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {contacts.slice(0, 8).map((c) => (
                <tr key={c.id}>
                  <td className="bold">{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.course || "—"}</td>
                  <td>
                    {c.isRead
                      ? <span className="badge badge-done"><HiCheckCircle /> Đã xử lý</span>
                      : <span className="badge badge-new"><HiClock /> Mới</span>
                    }
                  </td>
                  <td className="muted">
                    {c.createdAt?.toDate
                      ? c.createdAt.toDate().toLocaleString("vi-VN")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .dash-header { margin-bottom: 30px; }
        .dash-header h1 { font-size: 2rem; font-weight: 800; color: #1A1A2E; }
        .dash-header p { color: #636e72; margin-top: 6px; }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        :global(.stat-card) {
          background: white;
          border-radius: 18px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          text-decoration: none;
          transition: all 0.25s;
        }
        :global(.stat-card:hover) {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .stat-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem;
          flex-shrink: 0;
        }
        .stat-value {
          display: block;
          font-size: 2.2rem;
          font-weight: 800;
          color: #1A1A2E;
          line-height: 1;
        }
        .stat-label {
          display: block;
          font-size: 0.88rem;
          color: #636e72;
          margin-top: 4px;
          font-weight: 600;
        }

        .section-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .section-head h2 { font-size: 1.2rem; font-weight: 800; color: #1A1A2E; }
        :global(.view-all) { font-size: 0.9rem; font-weight: 700; color: #FF4500; text-decoration: none; }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th {
          text-align: left;
          padding: 10px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #aaa;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #f0f0f0;
        }
        .data-table td {
          padding: 14px 16px;
          font-size: 0.95rem;
          color: #2D3436;
          border-bottom: 1px solid #f9f9f9;
        }
        .data-table tr:last-child td { border-bottom: none; }
        .bold { font-weight: 700 !important; }
        .muted { color: #999 !important; font-size: 0.85rem !important; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .badge-new { background: #fff3e0; color: #FF4500; }
        .badge-done { background: #e8f5e9; color: #00B894; }
        .empty-state { text-align: center; padding: 40px; color: #aaa; }

        @media (max-width: 1100px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
