"use client";
import { useState, useEffect, useRef } from "react";
import { subscribeToCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firestore";
import { uploadImageWithProgress, deleteImage } from "@/lib/storage";
import { HiPlus, HiPencil, HiTrash, HiUpload, HiX, HiCheck, HiPhotograph, HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";

const EMPTY = { caption: "", imageUrl: "", imagePath: "", isActive: true, order: 0 };

export default function AchievementsAdmin() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const unsub = subscribeToCollection("achievements", setItems, "order", "asc");
    return unsub;
  }, []);

  const openAdd = () => { setForm({ ...EMPTY, order: items.length }); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(EMPTY); setEditId(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      let currentOrder = items.length;
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { 
          toast.error(`${file.name} vượt quá 10MB, bỏ qua!`); 
          continue; 
        }
        // Lấy tên file không có phần mở rộng làm chú thích mặc định
        const defaultCaption = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const res = await uploadImageWithProgress(file, "achievements", setUploadPct);
        await addDocument("achievements", {
          imageUrl: res.url,
          imagePath: res.path,
          caption: defaultCaption,
          isActive: true,
          order: currentOrder,
        });
        currentOrder++;
      }
      toast.success("Upload ảnh thành công!");
    } catch (err) { 
      toast.error("Upload thất bại!"); 
      console.error(err);
    }
    finally { setUploading(false); setUploadPct(0); }
  };

  const handleSave = async () => {
    if (!form.imageUrl) { toast.error("Vui lòng tải ảnh thành tích!"); return; }
    setSaving(true);
    try {
      const data = { ...form, order: Number(form.order) };
      if (editId) { 
        await updateDocument("achievements", editId, data); 
        toast.success("Cập nhật thành công!"); 
      } else { 
        await addDocument("achievements", data); 
        toast.success("Thêm thành tích mới thành công!"); 
      }
      closeModal();
    } catch { 
      toast.error("Lưu thất bại!"); 
    }
    finally { setSaving(false); }
  };

  const toggleActive = async (item) => {
    try {
      await updateDocument("achievements", item.id, { isActive: !item.isActive });
      toast.success(item.isActive ? "Đã ẩn thành tích!" : "Đã hiển thị thành tích!");
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteDocument("achievements", item.id);
      if (item.imagePath) await deleteImage(item.imagePath);
      toast.success("Đã xóa thành tích!");
    } catch { 
      toast.error("Xóa thất bại!"); 
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản Lý Thành Tích Học Sinh</h1>
          <p>{items.length} thành tích đã được tải lên</p>
        </div>
        <div className="header-actions">
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />
          <button className="btn-upload" onClick={() => fileRef.current.click()} disabled={uploading}>
            <HiUpload /> {uploading ? `Đang upload (${Math.round(uploadPct)}%)...` : "Tải ảnh lên"}
          </button>
          <button className="btn-add" onClick={openAdd}><HiPlus /> Thêm Thủ Công</button>
        </div>
      </div>

      {uploading && (
        <div className="progress-wrap">
          <div className="progress-bg">
            <div className="progress-bar" style={{ width: `${uploadPct}%` }} />
          </div>
          <span>Đang upload ảnh... {Math.round(uploadPct)}%</span>
        </div>
      )}

      <div className="achievements-grid">
        {items.map(item => (
          <div key={item.id} className={`achievement-card ${!item.isActive ? "inactive" : ""}`}>
            <div className="card-preview">
              <img src={item.imageUrl} alt={item.caption} />
              <span className="order-badge">Thứ tự: {item.order}</span>
              {!item.isActive && <span className="hidden-badge">Đang ẩn</span>}
            </div>
            
            <div className="card-info">
              <h3>{item.caption || "(Không có tên)"}</h3>
              
              <div className="card-actions">
                <button 
                  className={`btn-toggle ${item.isActive ? "active" : ""}`} 
                  onClick={() => toggleActive(item)}
                  title={item.isActive ? "Ẩn trên trang chủ" : "Hiển thị trên trang chủ"}
                >
                  {item.isActive ? <HiEyeOff /> : <HiEye />} {item.isActive ? "Ẩn" : "Hiện"}
                </button>
                <button className="btn-edit" onClick={() => openEdit(item)}><HiPencil /> Sửa</button>
                <button className="btn-del" onClick={() => setDeleteId(item.id)}><HiTrash /> Xóa</button>
              </div>
            </div>

            {deleteId === item.id && (
              <div className="confirm-overlay">
                <p>Xóa ảnh thành tích này?</p>
                <div className="btns">
                  <button onClick={() => setDeleteId(null)}>Hủy</button>
                  <button className="del" onClick={() => handleDelete(item)}>Xác nhận xóa</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && !uploading && (
          <div className="empty">Chưa có ảnh thành tích nào. Hãy kéo thả hoặc bấm tải ảnh lên để bắt đầu!</div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Cập nhật Thành Tích" : "Thêm Thành Tích Mới"}</h2>
              <button onClick={closeModal}><HiX /></button>
            </div>
            <div className="modal-body">
              <div className="upload-area" onClick={() => !editId && fileRef.current.click()}>
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="preview" />
                ) : (
                  <div className="placeholder">
                    <HiPhotograph /> 
                    <span>Nhấn để tải ảnh học sinh vinh danh</span>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Chú thích (Tên học sinh / Giải thưởng)</label>
                <input 
                  name="caption" 
                  value={form.caption} 
                  onChange={handleChange} 
                  placeholder="VD: Hà Quang Huy - Thủ khoa THPT Bến Tre" 
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Thứ tự sắp xếp</label>
                  <input 
                    type="number" 
                    name="order" 
                    value={form.order} 
                    onChange={handleChange} 
                  />
                </div>
                <label className="toggle-label">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    checked={form.isActive} 
                    onChange={handleChange} 
                  />
                  <span>Hiển thị trên trang chủ</span>
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
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 15px; }
        .page-header h1 { font-size: 1.8rem; font-weight: 800; color: #1A1A2E; }
        .page-header p { color: #888; margin-top: 4px; }
        
        .header-actions { display: flex; gap: 12px; }
        .btn-upload { background: #00b894; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: inherit; }
        .btn-upload:hover { background: #00a884; }
        .btn-upload:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .btn-add { background: #FF4500; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: inherit; }
        .btn-add:hover { background: #e03e00; }
        
        .progress-wrap { background: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .progress-bg { height: 8px; background: #f0f0f0; border-radius: 4px; margin-bottom: 8px; overflow: hidden; }
        .progress-bar { height: 100%; background: #00b894; border-radius: 4px; transition: width 0.2s; }
        .progress-wrap span { font-size: 0.85rem; color: #636e72; font-weight: 600; }

        .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .achievement-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.05); position: relative; border: 1px solid #f0f0f0; transition: transform 0.2s; }
        .achievement-card:hover { transform: translateY(-4px); }
        .achievement-card.inactive { opacity: 0.65; }
        
        .card-preview { width: 100%; aspect-ratio: 4/5; position: relative; background: #fafafa; }
        .card-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .order-badge { position: absolute; bottom: 10px; left: 10px; background: rgba(26,26,46,0.8); color: white; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
        .hidden-badge { position: absolute; top: 10px; right: 10px; background: #e17055; color: white; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
        
        .card-info { padding: 18px; }
        .card-info h3 { font-size: 1.05rem; font-weight: 700; color: #1A1A2E; margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .card-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
        .card-actions button { padding: 8px 4px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 0.8rem; font-family: inherit; transition: all 0.2s; }
        .btn-toggle { background: #f0f2f5; color: #2d3436; }
        .btn-toggle.active { background: #ffeaa7; color: #d63031; }
        .btn-toggle:hover { background: #e2e5e9; }
        .btn-edit { background: #e8f4fd; color: #0984e3; }
        .btn-edit:hover { background: #d0e7ff; }
        .btn-del { background: #ffeaea; color: #d63031; }
        .btn-del:hover { background: #ffd1d1; }
        
        .confirm-overlay { position: absolute; inset: 0; background: rgba(26,26,46,0.96); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; color: white; padding: 20px; text-align: center; z-index: 5; }
        .confirm-overlay p { font-weight: 700; font-size: 1rem; }
        .btns { display: flex; gap: 10px; }
        .btns button { padding: 8px 16px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; font-family: inherit; }
        .btns button:first-child { background: rgba(255,255,255,0.15); color: white; }
        .btns button.del { background: #d63031; color: white; }
        
        .empty { padding: 80px 20px; text-align: center; color: #999; background: white; border-radius: 20px; font-weight: 600; grid-column: 1 / -1; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }

        /* Modal styling */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal { background: white; width: 100%; max-width: 500px; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .modal-header { padding: 20px 24px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h2 { font-size: 1.3rem; font-weight: 800; color: #1A1A2E; }
        .modal-header button { background: none; border: none; font-size: 1.6rem; cursor: pointer; color: #aaa; display: flex; }
        .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
        
        .upload-area { aspect-ratio: 4/5; border: 2px dashed #ddd; border-radius: 16px; overflow: hidden; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #fafafa; }
        .upload-area img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #aaa; font-weight: 700; text-align: center; padding: 20px; }
        .placeholder :global(svg) { font-size: 3rem; color: #FF4500; }
        
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.85rem; font-weight: 700; color: #2D3436; }
        .form-group input { padding: 12px; border: 2px solid #eee; border-radius: 10px; font-family: inherit; font-size: 0.95rem; }
        .form-group input:focus { outline: none; border-color: #FF4500; }
        
        .form-row { display: flex; gap: 15px; align-items: flex-end; }
        .toggle-label { display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; font-size: 0.9rem; user-select: none; margin-bottom: 12px; }
        .toggle-label input { width: 18px; height: 18px; accent-color: #FF4500; cursor: pointer; }
        
        .modal-footer { padding: 16px 24px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 12px; background: #fafafa; }
        .btn-cancel { padding: 11px 20px; border-radius: 10px; border: 1px solid #ddd; background: white; font-weight: 700; cursor: pointer; font-family: inherit; }
        .btn-save { background: #FF4500; color: white; border: none; padding: 11px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit; }
        .btn-save:hover { background: #e03e00; }

        @media (max-width: 600px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .header-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
