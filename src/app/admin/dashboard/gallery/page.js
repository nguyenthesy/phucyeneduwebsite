"use client";
import { useState, useEffect, useRef } from "react";
import { subscribeToCollection, addDocument, deleteDocument } from "@/lib/firestore";
import { uploadImageWithProgress, deleteImage } from "@/lib/storage";
import { HiUpload, HiTrash, HiPlus } from "react-icons/hi";
import toast from "react-hot-toast";

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [caption, setCaption] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const unsub = subscribeToCollection("gallery", setImages, "createdAt", "desc");
    return unsub;
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > 8 * 1024 * 1024) { toast.error(`${file.name} vượt 8MB, bỏ qua!`); continue; }
        const result = await uploadImageWithProgress(file, "gallery", setUploadPct);
        await addDocument("gallery", {
          imageUrl: result.url,
          imagePath: result.path,
          caption: caption || file.name,
          isActive: true,
        });
      }
      toast.success("Upload thành công!");
      setCaption("");
    } catch { toast.error("Upload thất bại!"); }
    finally { setUploading(false); setUploadPct(0); }
  };

  const handleDelete = async (img) => {
    try {
      await deleteDocument("gallery", img.id);
      if (img.imagePath) await deleteImage(img.imagePath);
      toast.success("Đã xóa ảnh!");
    } catch { toast.error("Xóa thất bại!"); }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Thư Viện Ảnh</h1>
          <p>{images.length} ảnh trong thư viện</p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="upload-zone">
        <div className="upload-drop" onClick={() => fileRef.current.click()}>
          <HiUpload className="upload-icon" />
          <h3>Kéo & thả hoặc nhấn để tải ảnh lên</h3>
          <p>Hỗ trợ JPG, PNG, WEBP. Tối đa 8MB/ảnh. Có thể chọn nhiều ảnh cùng lúc.</p>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />
          <button className="btn-upload-now">
            <HiPlus /> Chọn ảnh từ máy tính
          </button>
        </div>
        {uploading && (
          <div className="progress-wrap">
            <div className="progress-bg">
              <div className="progress-bar" style={{ width: `${uploadPct}%` }} />
            </div>
            <span>Đang upload... {Math.round(uploadPct)}%</span>
          </div>
        )}
      </div>

      {/* Gallery grid */}
      <div className="gallery-grid">
        {images.map(img => (
          <div key={img.id} className="gallery-item">
            <img src={img.imageUrl} alt={img.caption} />
            <div className="gallery-hover">
              <p>{img.caption}</p>
              <button className="gallery-del" onClick={() => setDeleteId(img.id)}>
                <HiTrash />
              </button>
            </div>
            {deleteId === img.id && (
              <div className="confirm-overlay">
                <p>Xóa ảnh này?</p>
                <div className="confirm-btns">
                  <button onClick={() => setDeleteId(null)}>Hủy</button>
                  <button className="del" onClick={() => handleDelete(img)}>Xóa</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && !uploading && (
        <div className="empty">Thư viện trống. Hãy upload ảnh đầu tiên!</div>
      )}

      <style jsx>{`
        .page-header { margin-bottom:24px; }
        .page-header h1 { font-size:1.8rem; font-weight:800; color:#1A1A2E; }
        .page-header p { color:#999; margin-top:4px; }

        .upload-zone { margin-bottom:28px; }
        .upload-drop {
          background:white; border:2px dashed #ddd; border-radius:20px;
          padding:50px; text-align:center; cursor:pointer;
          transition:all 0.2s;
        }
        .upload-drop:hover { border-color:#FF4500; background:#fff8f5; }
        .upload-icon { font-size:3rem; color:#FF4500; margin-bottom:15px; }
        .upload-drop h3 { font-size:1.2rem; font-weight:700; color:#1A1A2E; margin-bottom:8px; }
        .upload-drop p { color:#999; margin-bottom:20px; font-size:0.9rem; }
        .btn-upload-now {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 24px; border-radius:12px;
          background:#FF4500; color:white; border:none;
          font-family:inherit; font-size:0.95rem; font-weight:700;
          cursor:pointer; transition:all 0.2s;
        }
        .btn-upload-now:hover { background:#E03E00; }
        .progress-wrap { margin-top:16px; text-align:center; }
        .progress-bg { height:8px; background:#f0f0f0; border-radius:4px; margin-bottom:8px; }
        .progress-bar { height:8px; background:#FF4500; border-radius:4px; transition:width 0.2s; }
        .progress-wrap span { font-size:0.85rem; color:#636e72; font-weight:600; }

        .gallery-grid {
          display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
          gap:14px;
        }
        .gallery-item { position:relative; border-radius:14px; overflow:hidden; aspect-ratio:1; }
        .gallery-item img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.3s; }
        .gallery-item:hover img { transform:scale(1.05); }
        .gallery-hover {
          position:absolute; inset:0;
          background:rgba(0,0,0,0.55);
          display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:12px;
          opacity:0; transition:opacity 0.25s; padding:16px; text-align:center;
        }
        .gallery-item:hover .gallery-hover { opacity:1; }
        .gallery-hover p { color:white; font-size:0.85rem; font-weight:600; }
        .gallery-del {
          padding:8px 16px; border-radius:8px;
          background:#e17055; border:none; color:white;
          font-size:1.1rem; cursor:pointer; display:flex;
        }
        .confirm-overlay {
          position:absolute; inset:0; background:rgba(26,26,46,0.9);
          display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:12px;
          border-radius:14px;
        }
        .confirm-overlay p { color:white; font-weight:700; }
        .confirm-btns { display:flex; gap:10px; }
        .confirm-btns button {
          padding:8px 18px; border-radius:8px; border:none;
          font-family:inherit; font-weight:700; cursor:pointer;
          background:rgba(255,255,255,0.15); color:white;
        }
        .confirm-btns button.del { background:#e17055; }
        .empty { text-align:center; padding:60px; color:#aaa; font-size:1.05rem; background:white; border-radius:20px; }
      `}</style>
    </div>
  );
}
