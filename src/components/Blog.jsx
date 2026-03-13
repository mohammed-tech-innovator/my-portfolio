import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Calendar } from 'lucide-react';

const cx = (...args) => args.filter(Boolean).join(' ');

// ==========================================
// CONFIGURATION
// ==========================================
// Update this URL to point to your actual Blog API.
export const BLOG_API_URL = process.env.REACT_APP_BLOG_API_URL || 'https://api.example.com/v1/blogs';

// Fallback local blogs in case the API is offline
const FALLBACK_BLOGS = [
  {
    id: 1,
    title: 'Demystifying Proximal Policy Optimization (PPO)',
    summary: 'A deep dive into how PPO balances sample complexity and training stability in reinforcement learning environments.',
    date: '2025-02-15',
    url: '#',
    tags: ['Reinforcement Learning', 'PPO', 'Theory']
  },
  {
    id: 2,
    title: 'Building a Vision-Based Autopilot from Scratch',
    summary: 'Lessons learned from training YOLOv4 and U-Net models for a physical Raspberry Pi self-driving car.',
    date: '2023-09-10',
    url: '#',
    tags: ['Computer Vision', 'YOLOv4', 'Robotics']
  },
  {
    id: 3,
    title: 'The Future of AI in Medical Document Processing',
    summary: 'How hierarchical RL agents are revolutionizing the way we extract and process complex medical data with minimal human intervention.',
    date: '2025-11-05',
    url: '#',
    tags: ['NLP', 'Healthcare', 'AI Pipeline']
  }
];

export default function Blog({ darkMode }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(BLOG_API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Assume data returns an array of blogs or an object containing them
        const fetchedBlogs = Array.isArray(data) ? data : (data.blogs || data.posts || []);
        if (fetchedBlogs.length > 0) {
          setBlogs(fetchedBlogs);
        } else {
          throw new Error('No blogs found in API response');
        }
      } catch (err) {
        console.warn('Blog API unavailable or failed, using fallback data:', err);
        setError(true);
        setBlogs(FALLBACK_BLOGS);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blog" className={cx('py-24 px-6 reveal', darkMode ? 'bg-gray-800/50' : 'bg-slate-50')}>
      <div className="max-w-6xl mx-auto">
        <h2 className={cx('text-3xl font-bold mb-6 font-mono flex items-center gap-3', darkMode ? 'text-white' : 'text-gray-900')}>
          $ curl {BLOG_API_URL}
        </h2>
        
        {error && (
          <div className={cx("mb-6 p-3 rounded text-sm font-mono border", darkMode ? "bg-yellow-900/30 border-yellow-700/50 text-yellow-400" : "bg-yellow-50 border-yellow-200 text-yellow-700")}>
            {`// Warning: Could not connect to external API. Loading cached local data.`}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton Loading States
            [1, 2, 3].map((n) => (
              <div key={n} className={cx('p-6 rounded-lg border animate-pulse', darkMode ? 'bg-gray-900 border-gray-700' : 'bg-slate-100 border-slate-300')}>
                <div className={cx('h-6 w-3/4 mb-4 rounded', darkMode ? 'bg-gray-700' : 'bg-gray-300')}></div>
                <div className={cx('h-4 w-1/4 mb-4 rounded', darkMode ? 'bg-gray-700' : 'bg-gray-300')}></div>
                <div className={cx('h-20 w-full mb-4 rounded', darkMode ? 'bg-gray-700' : 'bg-gray-300')}></div>
                <div className="flex gap-2">
                   <div className={cx('h-6 w-16 rounded', darkMode ? 'bg-gray-700' : 'bg-gray-300')}></div>
                   <div className={cx('h-6 w-16 rounded', darkMode ? 'bg-gray-700' : 'bg-gray-300')}></div>
                </div>
              </div>
            ))
          ) : (
            // Render Actual Blogs
            blogs.map((blog) => (
              <article 
                key={blog.id} 
                className={cx(
                  'p-6 rounded-lg border transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col', 
                  darkMode ? 'bg-gray-900 border-gray-700 hover:border-blue-500 hover:shadow-blue-900/20' : 'bg-slate-100 border-slate-300 hover:border-blue-400 hover:shadow-blue-500/10'
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <BookOpen size={20} className={cx(darkMode ? "text-blue-400" : "text-blue-600")} />
                  <time className={cx('font-mono text-xs flex items-center gap-1', darkMode ? 'text-gray-500' : 'text-gray-500')}>
                    <Calendar size={12} /> {blog.date}
                  </time>
                </div>
                
                <h3 className={cx('text-xl font-bold mb-3 leading-tight', darkMode ? 'text-white' : 'text-gray-900')}>
                  {blog.title}
                </h3>
                
                <p className={cx('mb-6 text-sm leading-relaxed flex-grow', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                  {blog.summary}
                </p>

                <div>
                  {blog.tags?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {blog.tags.map((t, k) => (
                        <span key={k} className={cx('px-2 py-1 rounded text-xs font-mono', darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600')}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <a 
                    href={blog.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={cx('inline-flex items-center gap-1 text-sm font-bold transition-colors', darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800')}
                  >
                    Read Article <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
