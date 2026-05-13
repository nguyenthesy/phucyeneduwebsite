"use client";
import { useState, useEffect, useRef } from "react";
import { subscribeToCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firestore";
import { uploadImageWithProgress, deleteImage } from "@/lib/storage";
import { HiPlus, HiPencil, HiTrash, HiUpload, HiX, HiCheck } from "react-icons/hi";
import toast from "react-hot-toast";

const EMPTY_FORM = { title: "", age: "", level: "", desc: "", schedule: "", price: "", imageUrl: "", imagePath: "", isActive: true, order: 0 };

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const unsub = subscribeToCollection("courses", setCourses, "order", "asc");
    return unsub;
  }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (c) => { setForm(c); setEditId(c.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setEditId(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Ảnh tối đa 5MB!"); return; }
    setUploading(true);
    try {
      const result = await uploadImageWithProgress(file, "courses", setUploadPct);
      setForm(prev => ({ ...prev, imageUrl: result.url, imagePath: result.path }));
      toast.success("Upload ảnh thành công!");
    } catch {
      toast.error("Upload ảnh thất bại!");
    } finally { setUploading(false); setUploadPct(0); }
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Vui lòng nhập tên khóa học!"); return; }
    setSaving(true);
    try {
      const data = { ...form, order: Number(form.order) || 0 };
      if (editId) {
        await updateDocument("courses", editId, data);
        toast.success("Cập nhật thành công!");
      } else {
        await addDocument("courses", data);
        toast.success("Thêm khóa học thành công!");
      }
      closeModal();
    } catch { toast.error("Lưu thất bại!"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, imagePath) => {
    try {
      await deleteDocument("courses", id);
      if (imagePath) await deleteImage(imagePath);
      toast.success("Đã xóa khóa học!");
    } catch { toast.error("Xóa thất bại!"); }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản Lý Khóa Học</h1>
          <p>{courses.length} khóa học hiện có</p>
        </div>
        <button className="btn-add" onClick={openAdd}><HiPlus /> Thêm khóa học</button>
      </div>

      <div className="card-grid">
        {courses.map(c => (
          <div key={c.id} className={`course-card ${!c.isActive ? "inactive" : ""}`}>
            <div className="course-thumb">
              {c.imageUrl
                ? <img src={c.imageUrl} alt={c.title} />
                : <div className="no-img">📚</div>
              }
              <span className={`status-dot ${c.isActive ? "active" : "off"}`} />
            </div>
            <div className="course-body">
              <h3>{c.title}</h3>
              <div className="course-meta">
                {c.age && <span className="tag">{c.age}</span>}
                {c.level && <span className="tag">{c.level}</span>}
              </div>
              {c.price && <p className="price">{c.price}</p>}
            </div>
            <div className="course-actions">
              <button className="btn-edit" onClick={() => openEdit(c)}><HiPencil /> Sửa</button>
              <button className="btn-del" onClick={() => setDeleteId(c.id)}><HiTrash /></button>
            </div>
            {deleteId === c.id && (
              <div className="confirm-overlay">
                <p>Xóa khóa học này?</p>
                <div className="confirm-btns">
                  <button className="btn-cancel" onClick={() => setDeleteId(null)}>Hủy</button>
                  <button className="btn-confirm-del" onClick={() => handleDelete(c.id, c.imagePath)}>Xóa</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {courses.length === 0 && (
          <div className="empty">Chưa có khóa học nào. Nhấn "Thêm khóa học" để bắt đầu!</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Sửa khóa học" : "Thêm khóa học mới"}</h2>
              <button className="modal-close" onClick={closeModal}><HiX /></button>
            </div>
            <div className="modal-body">
              {/* Image Upload */}
              <div className="img-upload-area">
                {form.imageUrl
                  ? <img src={form.imageUrl} alt="preview" className="img-preview" />
                  : <div className="upload-placeholder" onClick={() => fileRef.current.click()}>
                      <HiUpload className="upload-icon" />
                      <span>Nhấn để tải ảnh lên</span>
                    </div>
                }
                {form.imageUrl && (
                  <button className="change-img-btn" onClick={() => fileRef.current.click()}>Đổi ảnh</button>
                )}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar" style={{ width: `${uploadPct}%` }} />
                    <span>{Math.round(uploadPct)}%</span>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="field full">
                  <label>Tên khóa học *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="VD: Tiếng Anh Mầm Non" />
                </div>
                <div className="field">
                  <label>Độ tuổi</label>
                  <input name="age" value={form.age} onChange={handleChange} placeholder="VD: 3-6 tuổi" />
                </div>
                <div className="field">
                  <label>Cấp độ</label>
                  <select name="level" value={form.level} onChange={handleChange}>
                    <option value="">-- Chọn cấp độ --</option>
                    <option>Beginner</option>
                    <option>Elementary</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="field">
                  <label>Học phí</label>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="VD: 1.500.000đ/tháng" />
                </div>
                <div className="field">
                  <label>Lịch học</label>
                  <input name="schedule" value={form.schedule} onChange={handleChange} placeholder="VD: T2, T4, T6" />
                </div>
                <div className="field">
                  <label>Thứ tự hiển thị</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange} />
                </div>
                <div className="field full">
                  <label>Mô tả</label>
                  <textarea name="desc" value={form.desc} onChange={handleChange} rows="4" placeholder="Mô tả chi tiết khóa học..." />
                </div>
                <div className="field full toggle-field">
                  <label className="toggle-label">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                    <span className="toggle-text">Hiển thị trên trang chủ</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel-modal" onClick={closeModal}>Hủy</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : <><HiCheck /> Lưu</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
        .page-header h1 { font-size:1.8rem; font-weight:800; color:#1A1A2E; }
        .page-header p { color:#999; margin-top:4px; font-size:0.9rem; }
        .btn-add {
          display:flex; align-items:center; gap:8px;
          background:#FF4500; color:white; border:none;
          padding:12px 22px; border-radius:12px;
          font-family:inherit; font-size:0.95rem; font-weight:700;
          cursor:pointer; transition:all 0.2s; white-space:nowrap;
        }
        .btn-add:hover { background:#E03E00; transform:translateY(-2px); box-shadow:0 6px 20px rgba(255,69,0,0.3); }

        .card-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:20px; }
        .course-card {
          background:white; border-radius:16px; overflow:hidden;
          box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative;
          transition:all 0.25s;
        }
        .course-card.inactive { opacity:0.55; }
        .course-card:hover { box-shadow:0 8px 25px rgba(0,0,0,0.1); transform:translateY(-3px); }
        .course-thumb { position:relative; height:170px; background:#f5f5f5; }
        .course-thumb img { width:100%; height:100%; object-fit:cover; }
        .no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:3rem; }
        .status-dot {
          position:absolute; top:12px; right:12px;
          width:12px; height:12px; border-radius:50%; border:2px solid white;
        }
        .status-dot.active { background:#00B894; }
        .status-dot.off { background:#999; }
        .course-body { padding:18px 20px 0; }
        .course-body h3 { font-size:1.15rem; font-weight:700; margin-bottom:10px; }
        .course-meta { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
        .tag {
          padding:3px 10px; border-radius:50px; font-size:0.75rem;
          font-weight:700; background:#fff3e0; color:#FF4500;
        }
        .price { font-size:0.9rem; color:#0984E3; font-weight:700; margin-bottom:0; }
        .course-actions { display:flex; gap:8px; padding:14px 20px; }
        .btn-edit {
          flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
          background:#fff3e0; color:#FF4500; border:none;
          padding:9px; border-radius:10px;
          font-family:inherit; font-size:0.85rem; font-weight:700; cursor:pointer;
        }
        .btn-edit:hover { background:#FF4500; color:white; }
        .btn-del {
          width:38px; display:flex; align-items:center; justify-content:center;
          background:#ffeaea; color:#e17055; border:none;
          border-radius:10px; cursor:pointer; font-size:1.1rem;
        }
        .btn-del:hover { background:#e17055; color:white; }
        .confirm-overlay {
          position:absolute; inset:0; background:rgba(26,26,46,0.88);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:16px; color:white; text-align:center; padding:20px;
          border-radius:16px;
        }
        .confirm-overlay p { font-weight:700; font-size:1.05rem; }
        .confirm-btns { display:flex; gap:12px; }
        .btn-cancel, .btn-confirm-del {
          padding:9px 20px; border-radius:10px; border:none;
          font-family:inherit; font-size:0.9rem; font-weight:700; cursor:pointer;
        }
        .btn-cancel { background:rgba(255,255,255,0.15); color:white; }
        .btn-confirm-del { background:#e17055; color:white; }
        .empty { grid-column:1/-1; text-align:center; padding:60px; color:#aaa; font-size:1.05rem; }

        /* Modal */
        .modal-overlay {
          position:fixed; inset:0; background:rgba(0,0,0,0.55);
          z-index:500; display:flex; align-items:center; justify-content:center;
          padding:20px;
        }
        .modal {
          background:white; border-radius:24px;
          width:100%; max-width:680px; max-height:90vh;
          display:flex; flex-direction:column;
          box-shadow:0 30px 80px rgba(0,0,0,0.3);
          animation:modalIn 0.25s ease;
        }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .modal-header {
          display:flex; justify-content:space-between; align-items:center;
          padding:24px 28px; border-bottom:1px solid #f0f0f0;
        }
        .modal-header h2 { font-size:1.3rem; font-weight:800; color:#1A1A2E; }
        .modal-close { background:none; border:none; font-size:1.5rem; cursor:pointer; color:#999; }
        .modal-body { overflow-y:auto; padding:28px; flex:1; }
        .img-upload-area { margin-bottom:24px; }
        .img-preview { width:100%; height:200px; object-fit:cover; border-radius:12px; }
        .upload-placeholder {
          height:160px; border:2px dashed #ddd; border-radius:12px;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:10px; cursor:pointer; color:#aaa; transition:all 0.2s;
        }
        .upload-placeholder:hover { border-color:#FF4500; color:#FF4500; background:#fff8f5; }
        .upload-icon { font-size:2rem; }
        .change-img-btn {
          margin-top:10px; padding:8px 18px; border-radius:8px;
          border:1px solid #ddd; background:white;
          font-family:inherit; font-size:0.85rem; cursor:pointer;
        }
        .upload-progress { margin-top:10px; }
        .progress-bar-bg { height:6px; background:#f0f0f0; border-radius:3px; }
        .progress-bar { height:6px; background:#FF4500; border-radius:3px; transition:width 0.2s; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .field { display:flex; flex-direction:column; gap:6px; }
        .field.full { grid-column:1/-1; }
        .field label { font-size:0.85rem; font-weight:700; color:#2D3436; }
        .field input, .field select, .field textarea {
          padding:11px 14px; border:2px solid #eee; border-radius:10px;
          font-family:inherit; font-size:0.95rem; color:#2D3436;
          transition:border-color 0.2s;
        }
        .field input:focus, .field select:focus, .field textarea:focus {
          outline:none; border-color:#FF4500;
        }
        .toggle-field { flex-direction:row; align-items:center; }
        .toggle-label { display:flex; align-items:center; gap:10px; cursor:pointer; }
        .toggle-text { font-weight:600; font-size:0.95rem; color:#2D3436; }
        .modal-footer {
          display:flex; justify-content:flex-end; gap:12px;
          padding:20px 28px; border-top:1px solid #f0f0f0;
        }
        .btn-cancel-modal {
          padding:11px 24px; border-radius:10px; border:2px solid #eee;
          background:white; font-family:inherit; font-size:0.95rem;
          font-weight:700; cursor:pointer;
        }
        .btn-save {
          display:flex; align-items:center; gap:8px;
          padding:11px 28px; border-radius:10px; border:none;
          background:#FF4500; color:white;
          font-family:inherit; font-size:0.95rem; font-weight:700;
          cursor:pointer; transition:all 0.2s;
        }
        .btn-save:hover:not(:disabled) { background:#E03E00; }
        .btn-save:disabled { opacity:0.65; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
