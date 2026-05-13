/**
 * Cloudinary Image Upload Helper (Free & No Credit Card required)
 */

// THAY THÔNG TIN CỦA BẠN VÀO ĐÂY
const CLOUD_NAME = "dalarnohb"; 
const UPLOAD_PRESET = "phucyenweb"; // Bạn hãy thay tên Upload Preset (Unsigned) vào đây

/**
 * Upload ảnh lên Cloudinary
 * @param {File} file - File ảnh từ input
 * @param {string} folder - Thư mục lưu trữ (ví dụ: 'courses', 'news')
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadImageWithProgress = async (file, folder = "general", onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `phucyen_center/${folder}`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    
    // Trả về định dạng tương thích với code cũ
    return {
      url: data.secure_url,
      path: data.public_id // Lưu public_id để xóa nếu cần
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

/**
 * Xóa ảnh trên Cloudinary (Lưu ý: Xóa phía client cần cấu hình thêm, 
 * thông thường ta chỉ cần ghi đè URL mới hoặc để nguyên ảnh cũ)
 */
export const deleteImage = async (publicId) => {
  console.log("Delete request for:", publicId);
  // Với Cloudinary Unsigned, xóa phía client bị hạn chế bảo mật. 
  // Bạn có thể để trống hàm này, ảnh cũ sẽ tồn tại trên cloud nhưng không hiện trên web.
  return true;
};
