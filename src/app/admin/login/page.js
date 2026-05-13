"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Đăng nhập thành công!");
      router.push("/admin/dashboard");
    } catch (err) {
      const msg =
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Email hoặc mật khẩu không đúng!"
          : err.code === "auth/user-not-found"
          ? "Tài khoản không tồn tại!"
          : "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card glass">
        <div className="login-logo">
          <Image src="/logo.png" alt="Logo" width={72} height={72} />
          <h1>PHÚC YÊN EDU</h1>
          <p>Cổng Quản Trị Nội Dung</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Email quản trị</label>
            <div className="input-wrapper">
              <HiMail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phucyencenter.edu.vn"
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <HiLockClosed className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              "ĐĂNG NHẬP"
            )}
          </button>
        </form>

        <a href="/" className="back-link">← Quay về trang chủ</a>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: 'Outfit', sans-serif;
        }
        .login-bg {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #FF4500 150%);
          z-index: 0;
        }
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 50px 45px;
          color: white;
          box-shadow: 0 25px 60px rgba(0,0,0,0.4);
          margin: 20px;
        }
        .login-logo {
          text-align: center;
          margin-bottom: 40px;
        }
        .login-logo h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 15px 0 6px;
          letter-spacing: 1px;
        }
        .login-logo p {
          font-size: 0.9rem;
          opacity: 0.65;
          font-weight: 500;
          letter-spacing: 1.5px;
        }
        .login-form { display: flex; flex-direction: column; gap: 22px; }
        .field label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
          opacity: 0.85;
          letter-spacing: 0.5px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          font-size: 1.1rem;
          opacity: 0.5;
          color: white;
        }
        .input-wrapper input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
          color: white;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .input-wrapper input::placeholder { opacity: 0.4; }
        .input-wrapper input:focus {
          outline: none;
          border-color: #FF4500;
          background: rgba(255,255,255,0.12);
        }
        .toggle-pass {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          padding: 0;
        }
        .btn-login {
          margin-top: 10px;
          padding: 16px;
          border-radius: 12px;
          background: #FF4500;
          color: white;
          border: none;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          min-height: 52px;
        }
        .btn-login:hover:not(:disabled) {
          background: #E03E00;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,69,0,0.4);
        }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner {
          width: 22px; height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .back-link {
          display: block;
          text-align: center;
          margin-top: 30px;
          font-size: 0.9rem;
          opacity: 0.6;
          color: white;
          transition: opacity 0.2s;
        }
        .back-link:hover { opacity: 1; }
      `}</style>
    </div>
  );
}
