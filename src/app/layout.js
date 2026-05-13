import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ContactButtons from "@/components/public/ContactButtons";

export const metadata = {
  title: "Trung Tâm Anh Ngữ Phúc Yên Edu | Tiếng Anh Cho Trẻ Em & Người Đi Làm",
  description: "Phúc Yên Edu - Hệ thống đào tạo Anh ngữ chuẩn quốc tế tại Vĩnh Phúc. Chuyên đào tạo tiếng Anh trẻ em, giao tiếp và luyện thi chứng chỉ. Lộ trình cá nhân hóa, cam kết đầu ra.",
  keywords: "anh ngữ phúc yên, học tiếng anh phúc yên, trung tâm tiếng anh vĩnh phúc, phúc yên edu, luyện thi ielts phúc yên",
  openGraph: {
    title: "Trung Tâm Anh Ngữ Phúc Yên Edu",
    description: "Hệ thống đào tạo Anh ngữ chuẩn quốc tế tại Vĩnh Phúc",
    url: "https://anhnguphucyen.edu.vn",
    siteName: "Phúc Yên Edu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <AuthProvider>
          <ContactButtons />
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
