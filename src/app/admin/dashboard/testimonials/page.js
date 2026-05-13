"use client";
import { useState, useEffect, useRef } from "react";
import { subscribeToCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firestore";
import { uploadImageWithProgress, deleteImage } from "@/lib/storage";
import { HiPlus, HiPencil, HiTrash, HiUpload, HiX, HiCheck, HiStar } from "react-icons/hi";
import toast from "react-hot-toast";

const EMPTY = { name: "", role: "", content: "", rating: 5, imageUrl: "", imagePath: "", isActive: true, order: 0 };

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const unsub = subscribeToCollection("testimonials", setItems, "order", "asc");
    return unsub;
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(EMPTY); setEditId(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImageWithProgress(file, "testimonials", (p) => {});
      setForm(prev => ({ ...prev, imageUrl: res.url, imagePath: res.path }));
      toast.success("Upload ảnh thành công!");
    } catch { toast.error("Upload ảnh thất bại!"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.content) { toast.error("Vui lòng nhập tên và nội dung!"); return; }
    setSaving(true);
    try {
      const data = { ...form, rating: Number(form.rating), order: Number(form.order) };
      if (editId) { await updateDocument("testimonials", editId, data); toast.success("Cập nhật thành công!"); }
      else { await addDocument("testimonials", data); toast.success("Thêm thành công!"); }
      closeModal();
    } catch { toast.error("Lưu thất bại!"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, path) => {
    try {
      await deleteDocument("testimonials", id);
      if (path) await deleteImage(path);
      toast.success("Đã xóa!");
    } catch { toast.error("Xóa thất bại!"); }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản Lý Đánh Giá</h1>
          <p>{items.length} nhận xét từ phụ huynh & học sinh</p>
        </div>
        <button className="btn-add" onClick={openAdd}><HiPlus /> Thêm đánh giá</button>
      </div>

      <div className="card-grid">
        {items.map(item => (
          <div key={item.id} className={`item-card ${!item.isActive ? "inactive" : ""}`}>
            <div className="item-head">
              <div className="item-avatar">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span>👤</span>}
              </div>
              <div className="item-meta">
                <h3>{item.name}</h3>
                <p>{item.role}</p>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={i < item.rating ? "active" : ""} />
                  ))}
                </div>
              </div>
            </div>
            <p className="item-content">"{item.content}"</p>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => openEdit(item)}><HiPencil /> Sửa</button>
              <button className="btn-del" onClick={() => setDeleteId(item.id)}><HiTrash /></button>
            </div>
            {deleteId === item.id && (
              <div className="confirm-box">
                <p>Xóa đánh giá này?</p>
                <button onClick={() => setDeleteId(null)}>Hủy</button>
                <button className="del-confirm" onClick={() => handleDelete(item.id, item.imagePath)}>Xóa</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Sửa đánh giá" : "Thêm đánh giá mới"}</h2>
              <button onClick={closeModal}><HiX /></button>
            </div>
            <div className="modal-body">
              <div className="upload-section" onClick={() => fileRef.current.click()}>
                {form.imageUrl ? <img src={form.imageUrl} alt="preview" /> : 
                <div className="placeholder">{uploading ? "Đang tải..." : "Nhấn tải ảnh đại diện"}</div>}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
              </div>
              <div className="form-group">
                <label>Họ tên *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label>Chức danh/Vai trò</label>
                <input name="role" value={form.role} onChange={handleChange} placeholder="VD: Phụ huynh bé Bi" />
              </div>
              <div className="form-group">
                <label>Số sao (1-5)</label>
                <select name="rating" value={form.rating} onChange={handleChange}>
                  {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} sao</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Nội dung nhận xét *</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows="4" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thứ tự</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange} />
                </div>
                <label className="toggle">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                  <span>Hiển thị trên web</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : <><HiCheck /> Lưu</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; }
        .page-header h1 { font-size:1.8rem; font-weight:800; color:#1A1A2E; }
        .btn-add { background:#FF4500; color:white; border:none; padding:12px 24px; border-radius:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; }
        
        .card-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:20px; }
        .item-card { background:white; padding:25px; border-radius:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); position:relative; }
        .item-card.inactive { opacity:0.6; }
        .item-head { display:flex; gap:15px; margin-bottom:15px; }
        .item-avatar { width:60px; height:60px; border-radius:50%; overflow:hidden; background:#f0f0f0; display:flex; align-items:center; justify-content:center; }
        .item-avatar img { width:100%; height:100%; object-fit:cover; }
        .item-meta h3 { font-size:1.1rem; margin-bottom:4px; }
        .item-meta p { font-size:0.85rem; color:#666; margin-bottom:5px; }
        .stars { display:flex; gap:2px; color:#ddd; font-size:0.9rem; }
        .stars :global(.active) { color:#FFD700; }
        .item-content { font-size:0.95rem; line-height:1.6; color:#444; font-style:italic; margin-bottom:20px; }
        
        .item-actions { display:flex; gap:10px; }
        .btn-edit, .btn-del { flex:1; padding:8px; border-radius:10px; border:none; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; font-size:0.85rem; }
        .btn-edit { background:#fff3e0; color:#FF4500; }
        .btn-del { background:#ffeaea; color:#e17055; }
        
        .confirm-box { position:absolute; inset:0; background:rgba(26,26,46,0.95); border-radius:20px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:white; z-index:10; }
        .del-confirm { background:#e17055; color:white; border:none; padding:8px 20px; border-radius:10px; cursor:pointer; font-weight:700; }

        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .modal { background:white; width:100%; max-width:550px; border-radius:24px; display:flex; flex-direction:column; max-height:90vh; }
        .modal-header { padding:20px 25px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; }
        .modal-header h2 { font-size:1.25rem; font-weight:800; }
        .modal-header button { background:none; border:none; font-size:1.5rem; cursor:pointer; color:#999; }
        .modal-body { padding:25px; overflow-y:auto; display:flex; flex-direction:column; gap:15px; }
        .upload-section { height:120px; border:2px dashed #ddd; border-radius:15px; overflow:hidden; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .upload-section img { width:100px; height:100px; border-radius:50%; object-fit:cover; }
        .placeholder { color:#999; font-weight:600; font-size:0.9rem; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-group label { font-size:0.85rem; font-weight:700; color:#2D3436; }
        .form-group input, .form-group select, .form-group textarea { padding:12px; border:2px solid #eee; border-radius:10px; font-family:inherit; }
        .form-row { display:flex; align-items:center; justify-content:space-between; gap:20px; }
        .toggle { display:flex; align-items:center; gap:10px; font-weight:700; font-size:0.9rem; cursor:pointer; }
        .modal-footer { padding:20px 25px; border-top:1px solid #eee; display:flex; justify-content:flex-end; gap:12px; }
        .btn-cancel { padding:10px 20px; border-radius:10px; border:1px solid #ddd; background:none; font-weight:700; cursor:pointer; }
        .btn-save { background:#FF4500; color:white; border:none; padding:10px 30px; border-radius:10px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; }
      `}</style>
    </div>
  );
}
