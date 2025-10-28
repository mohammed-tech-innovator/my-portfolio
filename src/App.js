import React, { useEffect, useState } from 'react';
import ContactForm from './components/ContactForm';
import Hero from './components/Hero';
import {
  Moon,
  Sun,
  Github,
  Award,
  ExternalLink,
  Youtube,
} from 'lucide-react';

// --- Data (moved outside component so it isn't recreated on every render) ---
const PUBLICATIONS = [
  {
    title:
      'SHA-ZA: Advanced Reinforcement Learning for Othello Mastery Using Proximal Policy Optimization',
    authors: 'Mohammed Yousif',
    date: 'Feb 2025',
    doi: '10.18178/ijml.2025.15.1.1173',
    github: 'https://github.com/mohammed-tech-innovator/OthelloSHAZA'
  },
  {
    title:
      'Enhancing Generalization in Audio Deepfake Detection: A Neural Collapse Based Sampling and Training Approach',
    authors:
      'Mohammed Yousif, Jonat John Mathew, Huzaifa Pallan, Agamjeet Singh Padda, Syed Daniya Shah, Sara Adamski, Madhu Reddiboina, Arjun Pankajakshan',
    date: 'Apr 2024',
    arxiv: '2404.13008',
    github: 'https://github.com/mohammed-tech-innovator'
  },
  {
    title: 'Design and Implementation of a Computer Vision-Based Autopilot in a Simulation Environment',
    authors: 'Mohammed Yousif, Omer Salih, Magdi B. M. Amein',
    date: 'Aug 2023',
    doi: '10.22541/au.169175909.96817606/v1',
    github: 'https://github.com/mohammed-tech-innovator'
  }
];

const PROJECTS = [
  {
    title: 'Hierarchical RL Agent for Cost-Efficient Document Processing',
    date: 'Oct 2025',
    description:
      'Hierarchical RL agent (PPO + GRPO) to reduce labeling and processing cost in document pipelines. Includes POMDP formulation and lightweight vision encoders trained with contrastive learning.',
    tech: ['PyTorch', 'OpenCV', 'PPO', 'GRPO', 'Contrastive Learning'],
    github: 'https://github.com/mohammed-tech-innovator'
  },
  {
    title: 'OthelloSHAZA: Mastering Othello via Self-Play and RL',
    date: 'Feb 2024',
    description:
      'PPO-based self-play process that outperforms a classical MiniMax engine (up to depth 12). Focus on training efficiency and inference speed.',
    tech: ['PyTorch', 'NumPy', 'Numba', 'PPO', 'Self-Play'],
    github: 'https://github.com/mohammed-tech-innovator/OthelloSHAZA',
    video: 'https://youtube.com'
  },
  {
    title: 'Computer-Vision Autopilot for Autonomous Vehicles',
    date: 'Apr 2022',
    description:
      'End-to-end vision-based autopilot, trained YOLOv4 for traffic signs, and improved semantic segmentation with U-Net variants. Built a Raspberry Pi self-driving car.',
    tech: ['PyTorch', 'OpenCV', 'YOLOv4', 'U-Net', 'Raspberry Pi'],
    github: 'https://github.com/mohammed-tech-innovator',
    video: 'https://youtube.com'
  },
  {
    title: 'Euler: IoT Surgery Robot',
    date: 'Aug 2018',
    description:
      'A 4-DOF IoT surgical robot prototype (mechanics + electronics + simple web backend). Solved EMI issues using a Faraday enclosure.',
    tech: ['C++', 'Flask', 'Arduino', 'Raspberry Pi', 'AutoCAD']
  }
];

const SKILLS = {
  'Machine Learning & AI': [
    'PyTorch',
    'TensorFlow',
    'Keras',
    'Hugging Face',
    'scikit-learn',
    'OpenCV',
    'Reinforcement Learning',
    'RLHF',
    'QLoRA'
  ],
  Programming: ['Python', 'C++', 'C', 'Java', 'JavaScript', 'Go', 'SQL'],
  'Cloud & Infrastructure': ['GCP', 'Vertex AI', 'Docker', 'Linux', 'Bash', 'Git'],
  Specialized: ['Computer Vision', 'NLP', 'Robotics', 'FPGA (VHDL/Verilog)', 'Embedded Systems']
};

// small helper to combine classes conditionally without adding a dependency
const cx = (...args) => args.filter(Boolean).join(' ');

export default function Portfolio() {
  // initialize from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const val = localStorage.getItem('theme');
      if (val) return val === 'dark';
    } catch (e) {
      /* ignore */
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch (e) {
      // localStorage might be blocked in some contexts
    }
  }, [darkMode]);



  return (
    <div className={cx('min-h-screen transition-colors duration-300', darkMode ? 'dark bg-gray-900' : 'bg-gray-50')}> 
      <header className={cx('fixed top-0 w-full z-50 backdrop-blur-md', darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200', 'border-b')}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className={cx('font-mono text-xl font-bold', darkMode ? 'text-blue-400' : 'text-blue-600')}>MY_</div>

          <nav aria-label="Main navigation" className="flex items-center gap-6">
            <a href="#about" className={cx('font-mono text-sm transition', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>about</a>
            <a href="#publications" className={cx('font-mono text-sm transition', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>research</a>
            <a href="#projects" className={cx('font-mono text-sm transition', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>projects</a>
            <a href="#contact" className={cx('font-mono text-sm transition', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>contact</a>

            <button
              aria-pressed={darkMode}
              onClick={() => setDarkMode(prev => !prev)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={cx('p-2 rounded-lg transition-transform transform hover:scale-110 focus:outline-none',
                darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700')}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
          <Hero darkMode={darkMode} />
        {/* About */}
        <section id="about" className={cx('py-16 px-6', darkMode ? 'bg-gray-800/50' : 'bg-white')}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h2 className={cx('text-3xl font-bold mb-4 font-mono', darkMode ? 'text-white' : 'text-gray-900')}>$ whoami</h2>
              <p className={cx('text-lg mb-4 leading-relaxed', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                Dynamic AI Research Engineer with a strong focus on reinforcement learning, computer vision, and applied research engineering. I bridge research ideas to reliable systems and enjoy working on problems at the intersection of learning algorithms and real-world robotics.
              </p>

              <div className={cx('p-4 rounded-lg text-sm border', darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200')}>
                <div className={cx(darkMode ? 'text-green-400' : 'text-green-600')}>→ University of Khartoum</div>
                <div className={cx('ml-4', darkMode ? 'text-gray-400' : 'text-gray-600')}>B.Sc. Electrical & Electronics Engineering</div>
                <div className={cx('ml-4', darkMode ? 'text-blue-400' : 'text-blue-600')}>GPA: 8.91/10.0 — First Class Honours</div>
              </div>
            </div>

            <aside>
              <h3 className={cx('text-xl font-bold mb-4 font-mono', darkMode ? 'text-white' : 'text-gray-900')}>Recent Achievements</h3>
              <div className="space-y-3">
                {[{ icon: Award, text: 'Best Research Paper - ICOAI 2024, Dubai', year: '2024' }, { icon: Award, text: '40% cost reduction via RL agent', year: '2025' }, { icon: Award, text: 'Best Undergraduate Project (#1/49)', year: '2022' }, { icon: Award, text: 'Superhuman performance in medical document classification', year: '2025' }].map((it, i) => (
                  <div key={i} className={cx('flex items-start gap-3 p-3 rounded-lg', darkMode ? 'bg-gray-900/50' : 'bg-gray-50')}>
                    <it.icon size={18} className={cx(darkMode ? 'text-yellow-400' : 'text-yellow-600')} />
                    <div>
                      <div className={cx(darkMode ? 'text-gray-300' : 'text-gray-700')}>{it.text}</div>
                      <div className="text-sm font-mono text-gray-500">{it.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className={cx('text-3xl font-bold mb-6 font-mono', darkMode ? 'text-white' : 'text-gray-900')}>$ cat publications.txt</h2>

            <div className="space-y-4">
              {PUBLICATIONS.map((p, idx) => (
                <article key={idx} className={cx('p-6 rounded-lg border', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
                  <h3 className={cx('text-xl font-bold mb-1', darkMode ? 'text-white' : 'text-gray-900')}>{p.title}</h3>
                  <p className={cx('text-sm mb-3', darkMode ? 'text-gray-400' : 'text-gray-600')}>{p.authors}</p>

                  <div className="flex flex-wrap gap-3 items-center">
                    <span className={cx('font-mono text-sm', darkMode ? 'text-blue-400' : 'text-blue-600')}>{p.date}</span>

                    {p.doi && (
                      <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-1 text-sm underline', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                        <ExternalLink size={14} /> DOI
                      </a>
                    )}

                    {p.arxiv && (
                      <a href={`https://arxiv.org/abs/${p.arxiv}`} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-1 text-sm underline', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                        <ExternalLink size={14} /> arXiv
                      </a>
                    )}

                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-1 text-sm underline', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                        <Github size={14} /> Code
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className={cx('py-16 px-6', darkMode ? 'bg-gray-800/50' : 'bg-white')}>
          <div className="max-w-6xl mx-auto">
            <h2 className={cx('text-3xl font-bold mb-6 font-mono', darkMode ? 'text-white' : 'text-gray-900')}>$ ls -la projects/</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {PROJECTS.map((proj, i) => (
                <section key={i} className={cx('p-6 rounded-lg border transition', darkMode ? 'bg-gray-900 border-gray-700 hover:border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-400')}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={cx('text-xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{proj.title}</h3>
                    <time className={cx('font-mono text-xs', darkMode ? 'text-gray-500' : 'text-gray-500')}>{proj.date}</time>
                  </div>

                  <p className={cx('mb-4 text-sm leading-relaxed', darkMode ? 'text-gray-400' : 'text-gray-600')}>{proj.description}</p>

                  {proj.tech?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {proj.tech.map((t, k) => (
                        <span key={k} className={cx('px-2 py-1 rounded text-xs font-mono', darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600')}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4">
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-2 text-sm underline', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                        <Github size={16} /> Code
                      </a>
                    )}

                    {proj.video && (
                      <a href={proj.video} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-2 text-sm underline', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                        <Youtube size={16} /> Demo
                      </a>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className={cx('text-3xl font-bold mb-6 font-mono', darkMode ? 'text-white' : 'text-gray-900')}>$ cat skills.json</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(SKILLS).map(([category, items], i) => (
                <div key={i} className={cx('p-6 rounded-lg border', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
                  <h3 className={cx('text-lg font-bold mb-4 font-mono', darkMode ? 'text-blue-400' : 'text-blue-600')}>{`${category}:`}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s, j) => (
                      <span key={j} className={cx('px-3 py-1 rounded-full text-sm', darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700')}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className={cx('py-16 px-6', darkMode ? 'bg-gray-800/50' : 'bg-white')}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={cx('text-3xl font-bold mb-4 font-mono', darkMode ? 'text-white' : 'text-gray-900')}>$ contact --help</h2>
            <p className={cx('text-lg mb-6', darkMode ? 'text-gray-400' : 'text-gray-600')}>
              Interested in collaboration, research opportunities, or just want to connect?
            </p>

            {/* EmailJS Contact Form */}
            <ContactForm />

            <footer className={cx('mt-12 pt-8 border-t font-mono text-sm', darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500')}>
              © 2025 Mohammed Yousif. Built with React & Tailwind CSS.
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
