import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  container,
  sectionSpacing,
  heroSection,
  heroContent,
  heroTitle,
  heroSubtitle,
  heroButtons,
  featureCard,
  featureIcon,
  featureTitle,
  featureDescription,
  statsSection,
  statsGrid,
  statItem,
  statNumber,
  statLabel,
  cardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  mutedText,
  textGradient,
  cardHover,
} from "../styles/common";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user-api/articles");
        setArticles(res.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className={heroSection}>
        <div className={`${container} ${heroContent}`}>
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0066cc]">Welcome to MyBlog</p>
            <h1 className={heroTitle}>
              Publish stories that <span className={textGradient}>matter</span> and discover fresh voices every day.
            </h1>
            <p className={heroSubtitle}>
              A clean writing platform for readers, authors, and admins. Write your first article, connect with your audience, and manage your content in one polished experience.
            </p>
            <div className={heroButtons}>
              <Link to="/register" className="btn-primary">
                Start Writing Today
              </Link>
              <Link to="/login" className="btn-secondary">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${sectionSpacing} bg-white`}>
        <div className={container}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Why Choose MyBlog?</h2>
            <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
              Everything you need to create, share, and discover amazing content in one beautiful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${featureCard} ${cardHover}`}>
              <div className={featureIcon}>
                <svg className="w-6 h-6 text-[#0066cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className={featureTitle}>Write with Ease</h3>
              <p className={featureDescription}>
                Our intuitive editor makes writing a pleasure. Focus on your ideas while we handle the formatting.
              </p>
            </div>

            <div className={`${featureCard} ${cardHover}`}>
              <div className={featureIcon}>
                <svg className="w-6 h-6 text-[#0066cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={featureTitle}>Build Your Audience</h3>
              <p className={featureDescription}>
                Connect with readers who love your content. Grow your following and engage with your community.
              </p>
            </div>

            <div className={`${featureCard} ${cardHover}`}>
              <div className={featureIcon}>
                <svg className="w-6 h-6 text-[#0066cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className={featureTitle}>Secure & Private</h3>
              <p className={featureDescription}>
                Your content is safe with us. Advanced security measures protect your data and creative work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={statsSection}>
        <div className={container}>
          <div className={statsGrid}>
            <div className={statItem}>
              <div className={statNumber}>10K+</div>
              <div className={statLabel}>Articles Published</div>
            </div>
            <div className={statItem}>
              <div className={statNumber}>5K+</div>
              <div className={statLabel}>Active Authors</div>
            </div>
            <div className={statItem}>
              <div className={statNumber}>50K+</div>
              <div className={statLabel}>Monthly Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className={`${sectionSpacing} bg-[#f7f7fb]`}>
        <div className={container}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0066cc] mb-2">Featured Articles</p>
              <h2 className="text-4xl font-bold text-[#1d1d1f]">Stories to inspire your next post.</h2>
            </div>
            <Link to="/register" className="btn-primary whitespace-nowrap">
              Join MyBlog
            </Link>
          </div>

          {loading ? (
            <div className={loadingClass}>
              <div className="spinner"></div>
              <p className="mt-4">Loading amazing articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#6e6e73] text-lg">No articles available yet.</div>
              <p className="text-[#a1a1a6] mt-2">Be the first to publish something amazing!</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 6).map((article, index) => (
                <article
                  key={article._id}
                  className={`${cardClass} ${cardHover} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className={articleMeta}>{article.category || "General"}</span>
                  <h3 className={articleTitle}>{article.title}</h3>
                  <p className={articleExcerpt}>
                    {article.content.replace(/<[^>]*>/g, '').slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <p className={mutedText}>
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <Link to={`/article/${article._id}`} className={`${ghostBtn} inline-flex items-center`}>
                      Read story →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
