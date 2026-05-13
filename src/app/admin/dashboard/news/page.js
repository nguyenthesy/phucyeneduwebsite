"use client";
import { useState, useEffect, useRef } from "react";
import { subscribeToCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firestore";
import { uploadImageWithProgress, deleteImage } from "@/lib/storage";
import { HiPlus, HiPencil, HiTrash, HiUpload, HiX, HiCheck, HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";

const EMPTY = { title: "", excerpt: "", content: "", thumbnailUrl: "", thumbnailPath: "", isPublished: true, order: 0 };

export default function NewsAdmin() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const unsub = subscribeToCollection("news", setItems, "createdAt", "desc");
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
      const res = await uploadImageWithProgress(file, "news", (p) => {});
      setForm(prev => ({ ...prev, thumbnailUrl: res.url, thumbnailPath: res.path }));
      toast.success("Upload ảnh thành công!");
    } catch { toast.error("Upload ảnh thất bại!"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Vui lòng nhập tiêu đề!"); return; }
    setSaving(true);
    try {
      if (editId) { await updateDocument("news", editId, form); toast.success("Cập nhật thành công!"); }
      else { await addDocument("news", form); toast.success("Thêm bài viết thành công!"); }
      closeModal();
    } catch { toast.error("Lưu thất bại!"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, thumbPath) => {
    try {
      await deleteDocument("news", id);
      if (thumbPath) await deleteImage(thumbPath);
      toast.success("Đã xóa!");
    } catch { toast.error("Xóa thất bại!"); }
    setDeleteId(null);
  };

  const togglePublish = async (id, current) => {
    await updateDocument("news", id, { isPublished: !current });
    toast.success(current ? "Đã ẩn bài viết!" : "Đã đăng bài viết!");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản Lý Tin Tức</h1>
          <p>{items.length} bài viết</p>
        </div>
        <button className="btn-add" onClick={openAdd}><HiPlus /> Thêm bài viết</button>
      </div>

      <div className="news-list">
        {items.length === 0 && <div className="empty">Chưa có bài viết nào.</div>}
        {items.map(item => (
          <div key={item.id} className="news-row">
            <div className="news-thumb">
              {item.thumbnailUrl
                ? <img src={item.thumbnailUrl} alt={item.title} />
                : <div className="no-thumb">📰</div>
              }
            </div>
            <div className="news-info">
              <h3>{item.title}</h3>
              <p>{item.excerpt || "Không có mô tả ngắn"}</p>
              <span className={`status ${item.isPublished ? "pub" : "draft"}`}>
                {item.isPublished ? "Đã đăng" : "Bản nháp"}
              </span>
            </div>
            <div className="news-actions">
              <button className="btn-icon" onClick={() => togglePublish(item.id, item.isPublished)} title="Toggle hiển thị">
                {item.isPublished ? <HiEyeOff /> : <HiEye />}
              </button>
              <button className="btn-icon edit" onClick={() => openEdit(item)}><HiPencil /></button>
              <button className="btn-icon del" onClick={() => setDeleteId(item.id)}><HiTrash /></button>
            </div>
            {deleteId === item.id && (
              <div className="confirm-inline">
                <span>Xóa bài viết này?</span>
                <button onClick={() => setDeleteId(null)}>Hủy</button>
                <button className="del" onClick={() => handleDelete(item.id, item.thumbnailPath)}>Xóa</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Sửa bài viết" : "Thêm bài viết mới"}</h2>
              <button className="modal-close" onClick={closeModal}><HiX /></button>
            </div>
            <div className="modal-body">
              <div className="img-area" onClick={() => fileRef.current.click()}>
                {form.thumbnailUrl
                  ? <img src={form.thumbnailUrl} alt="thumb" />
                  : <div className="upload-ph"><HiUpload /> {uploading ? "Đang upload..." : "Nhấn để tải ảnh thumbnail"}</div>
                }
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
              </div>
              <div className="field">
                <label>Tiêu đề *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề bài viết..." />
              </div>
              <div className="field">
                <label>Mô tả ngắn</label>
                <input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Tóm tắt 1-2 câu..." />
              </div>
              <div className="field">
                <label>Nội dung</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows="8" placeholder="Nội dung chi tiết bài viết..." />
              </div>
              <label className="toggle-label">
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                <span>Đăng ngay lên website</span>
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : <><HiCheck /> Lưu bài viết</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
        .page-header h1 { font-size:1.8rem; font-weight:800; color:#1A1A2E; }
        .page-header p { color:#999; margin-top:4px; }
        .btn-add {
          display:flex; align-items:center; gap:8px;
          background:#FF4500; color:white; border:none;
          padding:12px 22px; border-radius:12px;
          font-family:inherit; font-size:0.95rem; font-weight:700;
          cursor:pointer; transition:all 0.2s; white-space:nowrap;
        }
        .btn-add:hover { background:#E03E00; transform:translateY(-2px); }
        .news-list { display:flex; flex-direction:column; gap:12px; }
        .news-row {
          background:white; border-radius:16px; padding:18px 22px;
          display:flex; align-items:center; gap:18px;
          box-shadow:0 2px 8px rgba(0,0,0,0.05); position:relative;
          transition:box-shadow 0.2s;
        }
        .news-row:hover { box-shadow:0 6px 20px rgba(0,0,0,0.09); }
        .news-thumb { width:90px; height:70px; border-radius:10px; overflow:hidden; flex-shrink:0; background:#f5f5f5; }
        .news-thumb img { width:100%; height:100%; object-fit:cover; }
        .no-thumb { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:1.8rem; }
        .news-info { flex:1; min-width:0; }
        .news-info h3 { font-size:1rem; font-weight:700; margin-bottom:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .news-info p { font-size:0.85rem; color:#999; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:8px; }
        .status { padding:3px 10px; border-radius:50px; font-size:0.72rem; font-weight:700; }
        .status.pub { background:#e8f5e9; color:#00B894; }
        .status.draft { background:#f5f5f5; color:#aaa; }
        .news-actions { display:flex; gap:8px; }
        .btn-icon {
          width:38px; height:38px; border-radius:10px; border:none;
          display:flex; align-items:center; justify-content:center;
          font-size:1.1rem; cursor:pointer;
          background:#f5f5f5; color:#636e72; transition:all 0.2s;
        }
        .btn-icon:hover { background:#eee; }
        .btn-icon.edit:hover { background:#fff3e0; color:#FF4500; }
        .btn-icon.del:hover { background:#ffeaea; color:#e17055; }
        .confirm-inline {
          position:absolute; right:22px; bottom:-50px;
          background:#1A1A2E; color:white; border-radius:12px;
          padding:12px 16px; display:flex; align-items:center;
          gap:12px; font-size:0.85rem; z-index:10;
          box-shadow:0 10px 30px rgba(0,0,0,0.2);
        }
        .confirm-inline button {
          padding:6px 14px; border-radius:8px; border:none;
          font-family:inherit; font-size:0.82rem; font-weight:700; cursor:pointer;
          background:rgba(255,255,255,0.15); color:white;
        }
        .confirm-inline button.del { background:#e17055; }
        .empty { text-align:center; padding:60px; color:#aaa; background:white; border-radius:16px; }

        /* Modal */
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:500; display:flex; align-items:center; justify-content:center; padding:20px; }
        .modal { background:white; border-radius:24px; width:100%; max-width:680px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 30px 80px rgba(0,0,0,0.3); animation:in 0.25s ease; }
        @keyframes in { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .modal-header { display:flex; justify-content:space-between; align-items:center; padding:22px 28px; border-bottom:1px solid #f0f0f0; }
        .modal-header h2 { font-size:1.3rem; font-weight:800; color:#1A1A2E; }
        .modal-close { background:none; border:none; font-size:1.5rem; cursor:pointer; color:#999; }
        .modal-body { overflow-y:auto; padding:24px 28px; flex:1; display:flex; flex-direction:column; gap:16px; }
        .img-area { height:160px; border:2px dashed #ddd; border-radius:12px; overflow:hidden; cursor:pointer; transition:all 0.2s; }
        .img-area:hover { border-color:#FF4500; }
        .img-area img { width:100%; height:100%; object-fit:cover; }
        .upload-ph { width:100%; height:100%; display:flex; align-items:center; justify-content:center; gap:10px; color:#aaa; font-weight:600; }
        .field { display:flex; flex-direction:column; gap:6px; }
        .field label { font-size:0.85rem; font-weight:700; color:#2D3436; }
        .field input, .field textarea { padding:11px 14px; border:2px solid #eee; border-radius:10px; font-family:inherit; font-size:0.95rem; }
        .field input:focus, .field textarea:focus { outline:none; border-color:#FF4500; }
        .toggle-label { display:flex; align-items:center; gap:10px; cursor:pointer; font-weight:600; font-size:0.9rem; }
        .modal-footer { display:flex; justify-content:flex-end; gap:12px; padding:18px 28px; border-top:1px solid #f0f0f0; }
        .btn-cancel { padding:11px 24px; border-radius:10px; border:2px solid #eee; background:white; font-family:inherit; font-size:0.95rem; font-weight:700; cursor:pointer; }
        .btn-save { display:flex; align-items:center; gap:8px; padding:11px 28px; border-radius:10px; border:none; background:#FF4500; color:white; font-family:inherit; font-size:0.95rem; font-weight:700; cursor:pointer; }
        .btn-save:hover:not(:disabled) { background:#E03E00; }
        .btn-save:disabled { opacity:0.65; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
