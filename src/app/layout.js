import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Anh Ngữ Phúc Yên Edu - Tiếng Anh Chuyên Nghiệp",
  description: "Trung tâm Anh Ngữ Phúc Yên Edu - Nâng tầm trí tuệ Việt. Khóa học tiếng Anh cho bé, học sinh và người đi làm.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
