"use client";
import { useState, useEffect, useRef } from "react";
import { subscribeToCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firestore";
import { uploadImageWithProgress, deleteImage } from "@/lib/storage";
import { HiPlus, HiPencil, HiTrash, HiUpload, HiX, HiCheck, HiPhotograph } from "react-icons/hi";
import toast from "react-hot-toast";

const EMPTY = { title: "", subtitle: "", imageUrl: "", imagePath: "", isActive: true, order: 0 };

export default function BannersAdmin() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const unsub = subscribeToCollection("banners", setItems, "order", "asc");
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
      const res = await uploadImageWithProgress(file, "banners", (p) => {});
      setForm(prev => ({ ...prev, imageUrl: res.url, imagePath: res.path }));
      toast.success("Upload ảnh banner thành công!");
    } catch { toast.error("Upload ảnh thất bại!"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.imageUrl) { toast.error("Vui lòng tải ảnh banner!"); return; }
    setSaving(true);
    try {
      const data = { ...form, order: Number(form.order) };
      if (editId) { await updateDocument("banners", editId, data); toast.success("Cập nhật thành công!"); }
      else { await addDocument("banners", data); toast.success("Thêm banner mới thành công!"); }
      closeModal();
    } catch { toast.error("Lưu thất bại!"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, path) => {
    try {
      await deleteDocument("banners", id);
      if (path) await deleteImage(path);
      toast.success("Đã xóa banner!");
    } catch { toast.error("Xóa thất bại!"); }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản Lý Banner</h1>
          <p>{items.length} ảnh bìa đầu trang chủ</p>
        </div>
        <button className="btn-add" onClick={openAdd}><HiPlus /> Thêm Banner</button>
      </div>

      <div className="banner-list">
        {items.map(item => (
          <div key={item.id} className={`banner-card ${!item.isActive ? "inactive" : ""}`}>
            <div className="banner-preview">
              <img src={item.imageUrl} alt={item.title} />
              {!item.isActive && <span className="hidden-badge">Đang ẩn</span>}
            </div>
            <div className="banner-info">
              <h3>{item.title || "(Không có tiêu đề)"}</h3>
              <p>{item.subtitle || "(Không có phụ đề)"}</p>
              <div className="item-actions">
                <button className="btn-edit" onClick={() => openEdit(item)}><HiPencil /> Sửa</button>
                <button className="btn-del" onClick={() => setDeleteId(item.id)}><HiTrash /> Xóa</button>
              </div>
            </div>
            {deleteId === item.id && (
              <div className="confirm-overlay">
                <p>Xóa banner này?</p>
                <div className="btns">
                  <button onClick={() => setDeleteId(null)}>Hủy</button>
                  <button className="del" onClick={() => handleDelete(item.id, item.imagePath)}>Xác nhận xóa</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <div className="empty">Chưa có banner nào. Nhấn "Thêm Banner" để bắt đầu!</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Cập nhật Banner" : "Thêm Banner mới"}</h2>
              <button onClick={closeModal}><HiX /></button>
            </div>
            <div className="modal-body">
              <div className="upload-area" onClick={() => fileRef.current.click()}>
                {form.imageUrl ? <img src={form.imageUrl} alt="preview" /> : 
                <div className="placeholder"><HiPhotograph /> {uploading ? "Đang tải ảnh..." : "Nhấn để chọn ảnh Banner"}</div>}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
              </div>
              <div className="form-group">
                <label>Tiêu đề chính (Dòng 1)</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="VD: Xóa tan nỗi lo mất gốc" />
              </div>
              <div className="form-group">
                <label>Tiêu đề phụ (Dòng 2 - Màu xanh)</label>
                <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="VD: Làm chủ tiếng Anh tự nhiên" />
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
                {saving ? "Đang lưu..." : <><HiCheck /> Lưu cấu hình</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; }
        .page-header h1 { font-size:1.8rem; font-weight:800; }
        .btn-add { background:#FF4500; color:white; border:none; padding:12px 24px; border-radius:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; }
        
        .banner-list { display:flex; flex-direction:column; gap:20px; }
        .banner-card { background:white; border-radius:24px; overflow:hidden; display:flex; box-shadow:0 10px 30px rgba(0,0,0,0.05); position:relative; }
        .banner-card.inactive { opacity:0.6; }
        .banner-preview { width:300px; height:180px; position:relative; background:#eee; }
        .banner-preview img { width:100%; height:100%; object-fit:cover; }
        .hidden-badge { position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.6); color:white; padding:4px 10px; border-radius:50px; font-size:0.75rem; font-weight:700; }
        
        .banner-info { padding:25px; flex:1; display:flex; flex-direction:column; justify-content:center; }
        .banner-info h3 { font-size:1.3rem; margin-bottom:8px; color:#1A1A2E; }
        .banner-info p { color:#666; margin-bottom:20px; font-size:0.95rem; }
        .item-actions { display:flex; gap:12px; }
        .btn-edit, .btn-del { padding:10px 20px; border-radius:10px; border:none; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; font-size:0.9rem; transition:all 0.2s; }
        .btn-edit { background:#f0f2f5; color:#1A1A2E; }
        .btn-edit:hover { background:#e2e5e9; }
        .btn-del { background:#ffeaea; color:#e17055; }
        .btn-del:hover { background:#ffd1d1; }
        
        .confirm-overlay { position:absolute; inset:0; background:rgba(26,26,46,0.95); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:15px; color:white; z-index:20; }
        .confirm-overlay p { font-weight:700; font-size:1.1rem; }
        .btns { display:flex; gap:12px; }
        .btns button { padding:10px 25px; border-radius:10px; border:none; font-weight:700; cursor:pointer; }
        .btns button.del { background:#e17055; color:white; }
        .empty { padding:60px; text-align:center; color:#999; background:white; border-radius:24px; font-weight:600; }

        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .modal { background:white; width:100%; max-width:650px; border-radius:24px; overflow:hidden; }
        .modal-header { padding:20px 30px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; }
        .modal-header h2 { font-size:1.4rem; font-weight:800; }
        .modal-header button { background:none; border:none; font-size:1.8rem; cursor:pointer; color:#999; }
        .modal-body { padding:30px; display:flex; flex-direction:column; gap:20px; }
        .upload-area { height:200px; border:2px dashed #ddd; border-radius:15px; overflow:hidden; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .upload-area img { width:100%; height:100%; object-fit:cover; }
        .placeholder { display:flex; flex-direction:column; align-items:center; gap:10px; color:#aaa; font-weight:700; }
        .placeholder :global(svg) { font-size:3rem; color:#FF4500; }
        .form-group { display:flex; flex-direction:column; gap:8px; }
        .form-group label { font-size:0.9rem; font-weight:700; color:#2D3436; }
        .form-group input { padding:14px; border:2px solid #eee; border-radius:12px; font-family:inherit; }
        .form-row { display:flex; align-items:center; justify-content:space-between; }
        .toggle { display:flex; align-items:center; gap:10px; font-weight:700; cursor:pointer; }
        .modal-footer { padding:20px 30px; border-top:1px solid #eee; display:flex; justify-content:flex-end; gap:15px; }
        .btn-cancel { padding:12px 25px; border-radius:12px; border:1px solid #ddd; background:none; font-weight:700; cursor:pointer; }
        .btn-save { background:#FF4500; color:white; border:none; padding:12px 35px; border-radius:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; }

        @media (max-width: 768px) {
          .banner-card { flex-direction:column; }
          .banner-preview { width:100%; height:180px; }
        }
      `}</style>
    </div>
  );
}
