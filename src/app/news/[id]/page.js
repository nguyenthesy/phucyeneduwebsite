"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDocument } from "@/lib/firestore";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { HiArrowLeft, HiCalendar } from "react-icons/hi";

export default function NewsDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getDocument("news", id).then(data => {
        setPost(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="loading">Đang tải bài viết...</div>;
  if (!post) return <div className="error">Không tìm thấy bài viết này.</div>;

  return (
    <main className="news-detail-page">
      <title>{`${post.title} | Phúc Yên Edu`}</title>
      <meta name="description" content={post.excerpt} />
      <Header />
      
      <div className="detail-container">
        <button className="btn-back" onClick={() => router.back()}>
          <HiArrowLeft /> Quay lại
        </button>

        <article className="post-article">
          <div className="post-meta">
            <span className="post-date">
              <HiCalendar /> {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString("vi-VN") : "Hôm nay"}
            </span>
          </div>
          
          <h1 className="post-title">{post.title}</h1>
          
          {post.thumbnailUrl && (
            <div className="post-banner">
              <img src={post.thumbnailUrl} alt={post.title} />
            </div>
          )}

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>

      <Footer />
      <style jsx>{`
        .news-detail-page { background: #f8f9fa; min-height: 100vh; padding-top: 100px; }
        .detail-container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        .btn-back { 
          display: flex; align-items: center; gap: 8px; 
          background: none; border: none; color: #FF4500; 
          font-weight: 700; cursor: pointer; margin-bottom: 30px;
        }
        .post-article { 
          background: white; padding: 50px; border-radius: 30px; 
          box-shadow: 0 10px 40px rgba(0,0,0,0.05); 
        }
        .post-meta { margin-bottom: 20px; color: #999; font-weight: 600; font-size: 0.9rem; }
        .post-date { display: flex; align-items: center; gap: 6px; }
        .post-title { font-size: 2.5rem; font-weight: 800; color: #1A1A2E; line-height: 1.3; margin-bottom: 30px; }
        .post-banner { width: 100%; border-radius: 20px; overflow: hidden; margin-bottom: 40px; }
        .post-banner img { width: 100%; height: auto; max-height: 500px; object-fit: cover; }
        .post-content { line-height: 1.8; color: #444; font-size: 1.1rem; }
        .post-content :global(p) { margin-bottom: 20px; }
        .post-content :global(img) { max-width: 100%; border-radius: 10px; margin: 20px 0; }
        
        @media (max-width: 768px) {
          .post-article { padding: 30px 20px; }
          .post-title { font-size: 1.8rem; }
        }
      `}</style>
    </main>
  );
}
