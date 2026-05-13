"use client";
import { useState, useEffect } from "react";
import { getDocument, updateDocument, addDocument } from "@/lib/firestore";
import { HiSave, HiPhone, HiMail, HiLocationMarker, HiGlobe } from "react-icons/hi";
import toast from "react-hot-toast";

const DEFAULT = {
  centerName: "Anh Ngữ Phúc Yên Edu",
  phone: "0123 456 789",
  email: "phucyenedu@gmail.com",
  address: "Số  135 Trưng Nhị, Phường Phúc Yên, Tỉnh Phú Thọ",
  facebookUrl: "",
  zaloUrl: "",
  youtubeUrl: "",
  statYears: "10+",
  statStudents: "10,000+",
  statTeachers: "150+",
  statBranches: "5+",
};

export default function SettingsAdmin() {
  const [form, setForm] = useState(DEFAULT);
  const [docId, setDocId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDocument("settings", "general").then(data => {
      if (data) { setForm({ ...DEFAULT, ...data }); setDocId(data.id); }
    });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (docId) {
        await updateDocument("settings", "general", form);
      } else {
        await addDocument("settings", { ...form, id: "general" });
        setDocId("general");
      }
      toast.success("Đã lưu cài đặt thành công!");
    } catch { toast.error("Lưu thất bại!"); }
    finally { setSaving(false); }
  };

  const sections = [
    {
      title: "Thông Tin Trung Tâm",
      icon: <HiGlobe />,
      fields: [
        { label: "Tên trung tâm", name: "centerName" },
        { label: "Số điện thoại", name: "phone" },
        { label: "Email", name: "email" },
        { label: "Địa chỉ", name: "address" },
      ]
    },
    {
      title: "Mạng Xã Hội",
      icon: <HiGlobe />,
      fields: [
        { label: "Facebook URL", name: "facebookUrl", placeholder: "https://facebook.com/..." },
        { label: "Zalo URL", name: "zaloUrl", placeholder: "https://zalo.me/..." },
        { label: "YouTube URL", name: "youtubeUrl", placeholder: "https://youtube.com/..." },
      ]
    },
    {
      title: "Số Liệu Thống Kê (Stats Bar)",
      icon: <HiGlobe />,
      fields: [
        { label: "Số năm kinh nghiệm", name: "statYears", placeholder: "10+" },
        { label: "Học viên tin tưởng", name: "statStudents", placeholder: "10,000+" },
        { label: "Giáo viên", name: "statTeachers", placeholder: "150+" },
        { label: "Cơ sở", name: "statBranches", placeholder: "5+" },
      ]
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cài Đặt Chung</h1>
          <p>Quản lý thông tin và nội dung hiển thị trên trang chủ</p>
        </div>
        <button className="btn-save-top" onClick={handleSave} disabled={saving}>
          <HiSave /> {saving ? "Đang lưu..." : "Lưu tất cả"}
        </button>
      </div>

      <div className="settings-grid">
        {sections.map((sec, si) => (
          <div key={si} className="settings-card">
            <h2 className="card-title">{sec.title}</h2>
            <div className="fields">
              {sec.fields.map((f, fi) => (
                <div key={fi} className="field">
                  <label>{f.label}</label>
                  <input
                    name={f.name}
                    value={form[f.name] || ""}
                    onChange={handleChange}
                    placeholder={f.placeholder || f.label}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
        .page-header h1 { font-size:1.8rem; font-weight:800; color:#1A1A2E; }
        .page-header p { color:#999; margin-top:4px; }
        .btn-save-top {
          display:flex; align-items:center; gap:8px;
          background:#FF4500; color:white; border:none;
          padding:12px 24px; border-radius:12px;
          font-family:inherit; font-size:0.95rem; font-weight:700;
          cursor:pointer; transition:all 0.2s; white-space:nowrap;
        }
        .btn-save-top:hover:not(:disabled) { background:#E03E00; transform:translateY(-2px); }
        .btn-save-top:disabled { opacity:0.65; cursor:not-allowed; }
        .settings-grid { display:flex; flex-direction:column; gap:20px; }
        .settings-card { background:white; border-radius:20px; padding:30px; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
        .card-title { font-size:1.1rem; font-weight:800; color:#1A1A2E; margin-bottom:24px; padding-bottom:14px; border-bottom:2px solid #f0f0f0; }
        .fields { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .field { display:flex; flex-direction:column; gap:6px; }
        .field label { font-size:0.85rem; font-weight:700; color:#636e72; }
        .field input {
          padding:12px 14px; border:2px solid #eee; border-radius:10px;
          font-family:inherit; font-size:0.95rem; color:#2D3436;
          transition:border-color 0.2s;
        }
        .field input:focus { outline:none; border-color:#FF4500; }
        @media (max-width:768px) {
          .fields { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}
