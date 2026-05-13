"use client";
import { useState, useEffect } from "react";
import { subscribeToCollection, updateDocument } from "@/lib/firestore";
import { HiPhone, HiMail, HiAnnotation, HiCheck, HiTrash } from "react-icons/hi";
import { deleteDocument } from "@/lib/firestore";
import toast from "react-hot-toast";

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsub = subscribeToCollection("contacts", setContacts);
    return unsub;
  }, []);

  const filtered = filter === "new"
    ? contacts.filter(c => !c.isRead)
    : filter === "done"
    ? contacts.filter(c => c.isRead)
    : contacts;

  const markRead = async (id) => {
    await updateDocument("contacts", id, { isRead: true });
    toast.success("Đã đánh dấu xử lý!");
  };
  const handleDelete = async (id) => {
    await deleteDocument("contacts", id);
    toast.success("Đã xóa!");
  };

  const newCount = contacts.filter(c => !c.isRead).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản Lý Đăng Ký</h1>
          <p>{newCount > 0 ? `${newCount} đăng ký mới chưa xử lý` : "Tất cả đã xử lý"}</p>
        </div>
        <div className="filter-tabs">
          {[["all","Tất cả"],["new","Mới"],["done","Đã xử lý"]].map(([v,l]) => (
            <button key={v} className={`tab ${filter===v?"active":""}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="contacts-list">
        {filtered.length === 0 ? (
          <div className="empty">Không có dữ liệu</div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className={`contact-row ${!c.isRead ? "is-new" : ""}`}>
              <div className="contact-avatar">
                {c.name?.charAt(0).toUpperCase()}
              </div>
              <div className="contact-info">
                <h3>{c.name} {!c.isRead && <span className="new-badge">MỚI</span>}</h3>
                <div className="contact-details">
                  <span><HiPhone /> {c.phone}</span>
                  {c.course && <span><HiAnnotation /> {c.course}</span>}
                  {c.note && <span>📝 {c.note}</span>}
                </div>
              </div>
              <div className="contact-time">
                {c.createdAt?.toDate
                  ? c.createdAt.toDate().toLocaleString("vi-VN")
                  : "—"}
              </div>
              <div className="contact-actions">
                {!c.isRead && (
                  <button className="btn-done" onClick={() => markRead(c.id)} title="Đánh dấu đã xử lý">
                    <HiCheck /> Xử lý
                  </button>
                )}
                <button className="btn-del-sm" onClick={() => handleDelete(c.id)} title="Xóa">
                  <HiTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; flex-wrap:wrap; gap:16px; }
        .page-header h1 { font-size:1.8rem; font-weight:800; color:#1A1A2E; }
        .page-header p { color:#999; margin-top:4px; font-size:0.9rem; }
        .filter-tabs { display:flex; gap:8px; }
        .tab {
          padding:8px 18px; border-radius:50px;
          border:2px solid #eee; background:white;
          font-family:inherit; font-size:0.85rem; font-weight:700;
          cursor:pointer; transition:all 0.2s; color:#636e72;
        }
        .tab.active { border-color:#FF4500; background:#FF4500; color:white; }

        .contacts-list { display:flex; flex-direction:column; gap:12px; }
        .contact-row {
          background:white; border-radius:16px; padding:20px 24px;
          display:flex; align-items:center; gap:20px;
          box-shadow:0 2px 8px rgba(0,0,0,0.05);
          border:2px solid transparent;
          transition:all 0.2s;
        }
        .contact-row.is-new { border-color:#FF4500; background:#fff8f5; }
        .contact-avatar {
          width:50px; height:50px; flex-shrink:0;
          border-radius:50%;
          background:linear-gradient(135deg,#FF4500,#FFB347);
          color:white; display:flex; align-items:center; justify-content:center;
          font-size:1.3rem; font-weight:800;
        }
        .contact-info { flex:1; min-width:0; }
        .contact-info h3 { font-size:1.05rem; font-weight:700; margin-bottom:6px; display:flex; align-items:center; gap:8px; }
        .new-badge {
          background:#FF4500; color:white;
          padding:2px 8px; border-radius:50px; font-size:0.65rem; font-weight:700;
          letter-spacing:0.5px;
        }
        .contact-details { display:flex; flex-wrap:wrap; gap:16px; color:#636e72; font-size:0.88rem; }
        .contact-details span { display:flex; align-items:center; gap:5px; }
        .contact-time { font-size:0.82rem; color:#aaa; white-space:nowrap; }
        .contact-actions { display:flex; gap:8px; }
        .btn-done {
          display:flex; align-items:center; gap:6px;
          padding:8px 16px; border-radius:10px;
          background:#e8f5e9; color:#00B894; border:none;
          font-family:inherit; font-size:0.85rem; font-weight:700; cursor:pointer;
          white-space:nowrap;
        }
        .btn-done:hover { background:#00B894; color:white; }
        .btn-del-sm {
          width:36px; height:36px; border-radius:10px;
          background:#ffeaea; color:#e17055; border:none;
          display:flex; align-items:center; justify-content:center;
          font-size:1.1rem; cursor:pointer;
        }
        .btn-del-sm:hover { background:#e17055; color:white; }
        .empty { text-align:center; padding:60px; color:#aaa; font-size:1.05rem; background:white; border-radius:16px; }
      `}</style>
    </div>
  );
}
