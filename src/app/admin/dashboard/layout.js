"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  HiHome, HiPhotograph, HiBookOpen, HiNewspaper,
  HiStar, HiCollection, HiCog, HiLogout,
  HiUsers, HiChevronDown, HiExternalLink
} from "react-icons/hi";
import Image from "next/image";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin/dashboard", icon: <HiHome />, label: "Tổng quan" },
  { href: "/admin/dashboard/banners", icon: <HiPhotograph />, label: "Quản lý Banner" },
  { href: "/admin/dashboard/courses", icon: <HiBookOpen />, label: "Khóa học" },
  { href: "/admin/dashboard/news", icon: <HiNewspaper />, label: "Tin tức" },
  { href: "/admin/dashboard/testimonials", icon: <HiStar />, label: "Đánh giá" },
  { href: "/admin/dashboard/gallery", icon: <HiCollection />, label: "Thư viện ảnh" },
  { href: "/admin/dashboard/contacts", icon: <HiUsers />, label: "Đăng ký" },
  { href: "/admin/dashboard/settings", icon: <HiCog />, label: "Cài đặt" },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    toast.success("Đã đăng xuất!");
    router.push("/admin/login");
  };

  if (loading || !user) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <style jsx>{`
          .admin-loading {
            min-height: 100vh; display: flex;
            align-items: center; justify-content: center;
            background: #0F0F1E;
          }
          .spinner {
            width: 50px; height: 50px;
            border: 4px solid rgba(255,69,0,0.2);
            border-top-color: #FF4500;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div>
            <span className="logo-name">PHÚC YÊN</span>
            <span className="logo-sub">ADMIN CMS</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" className="view-site">
            <HiExternalLink /> Xem trang chủ
          </a>
          <button className="logout-btn" onClick={handleLogout}>
            <HiLogout /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <div className="admin-topbar">
          <h2 className="page-title">CMS - Phúc Yên Edu</h2>
          <div className="admin-user">
            <div className="user-avatar">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span>{user.email}</span>
          </div>
        </div>

        <div className="admin-content">
          {children}
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          background: #F0F2F5;
        }
        /* ---- Sidebar ---- */
        .sidebar {
          width: 260px;
          background: #1A1A2E;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          overflow-y: auto;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .logo-name {
          display: block;
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          line-height: 1;
        }
        .logo-sub {
          display: block;
          color: #FF4500;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin-top: 3px;
        }
        .sidebar-nav {
          flex: 1;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        :global(.nav-item) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        :global(.nav-item:hover) {
          background: rgba(255,69,0,0.15);
          color: #FF4500;
        }
        .nav-icon {
          font-size: 1.25rem;
          display: flex;
        }
        .sidebar-footer {
          padding: 16px 12px 24px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .view-site, .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .view-site {
          color: rgba(255,255,255,0.5);
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .view-site:hover { background: rgba(255,255,255,0.06); color: white; }
        .logout-btn {
          background: rgba(255,69,0,0.15);
          border: none;
          color: #FF6B35;
        }
        .logout-btn:hover { background: rgba(255,69,0,0.3); color: white; }

        /* ---- Main ---- */
        .admin-main {
          margin-left: 260px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .admin-topbar {
          background: white;
          padding: 0 30px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          position: sticky; top: 0; z-index: 50;
        }
        .page-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A1A2E;
        }
        .admin-user {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #636e72;
          font-size: 0.9rem;
        }
        .user-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF4500, #FFB347);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
        }
        .admin-content {
          padding: 30px;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
