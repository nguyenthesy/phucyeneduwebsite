import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Anh Ngữ Phúc Yên Edu - Tiếng Anh Chuyên Nghiệp",
  description: "Trung tâm Anh Ngữ Phúc Yên Edu - Nâng tầm trí tuệ Việt. Khóa học tiếng Anh cho học sinh tiểu học và trung học cơ sở.",
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
