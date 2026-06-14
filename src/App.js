import React, { useEffect, useState } from 'react';
import ContactForm from './components/ContactForm';
import Hero from './components/Hero';
import LetterGlitch from './components/LetterGlitch';
import Waves from './components/Waves';
import ChatAgent from './components/ChatAgent';
import Blog from './components/Blog';
import Hyperspeed from './components/Hyperspeed';
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
    github: 'https://github.com/mohammed-tech-innovator/OthelloSHAZA'
  },
  {
    title: 'Computer-Vision Autopilot for Autonomous Vehicles',
    date: 'Apr 2022',
    description:
      'End-to-end vision-based autopilot, trained YOLOv4 for traffic signs, and improved semantic segmentation with U-Net variants. Built a Raspberry Pi self-driving car.',
    tech: ['PyTorch', 'OpenCV', 'YOLOv4', 'U-Net', 'Raspberry Pi'],
    github: 'https://github.com/mohammed-tech-innovator'
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
    // Default to dark mode
    return true;
  });
  
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch (e) {
      // localStorage might be blocked in some contexts
    }
  }, [darkMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id) {
              setActiveSection(entry.target.id);
            }
            if (entry.target.classList.contains('reveal')) {
              entry.target.classList.add('active');
            }
          }
        });
      },
      { rootMargin: '-10% 0px -20% 0px' }
    );

    const sections = document.querySelectorAll('section[id], .reveal');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navLinkClass = (id) => cx(
    'font-mono text-sm transition relative py-1',
    activeSection === id 
      ? (darkMode ? 'text-blue-400 font-bold' : 'text-blue-600 font-bold') 
      : (darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')
  );

  return (
    <div className={cx('min-h-screen transition-colors duration-300 bg-grid-pattern relative', darkMode ? 'dark bg-gray-900' : 'bg-slate-100')}> 
      <header className={cx('fixed top-0 w-full z-50 backdrop-blur-md', darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-slate-100/90 border-slate-300', 'border-b')}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className={cx('font-mono text-xl font-bold flex items-center', darkMode ? 'text-blue-400' : 'text-blue-600')}>
            MY_<span className="animate-blink w-2 h-5 ml-1 bg-current block"></span>
          </div>

          <nav aria-label="Main navigation" className="flex items-center gap-6">
            <a href="#about" className={navLinkClass('about')}>about</a>
            <a href="#publications" className={navLinkClass('publications')}>research</a>
            <a href="#projects" className={navLinkClass('projects')}>projects</a>
            <a href="#blog" className={navLinkClass('blog')}>blog</a>
            <a href="#contact" className={navLinkClass('contact')}>contact</a>

            <button
              aria-pressed={darkMode}
              onClick={() => setDarkMode(prev => !prev)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={cx('p-2 rounded-lg transition-transform transform hover:scale-110 focus:outline-none shadow-sm',
                darkMode ? 'bg-gray-800 text-yellow-400 hover:shadow-yellow-900/20' : 'bg-slate-300 text-gray-700 hover:shadow-gray-300/50')}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero and About Wrapper with Waves */}
        <div className={cx('relative overflow-hidden', darkMode ? 'bg-gray-900' : 'bg-slate-100')}>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Waves
              lineColor={darkMode ? '#1d4ed8' : '#93c5fd'}
              backgroundColor="transparent"
              waveSpeedX={0}
              waveSpeedY={0.01}
              waveAmpX={40}
              waveAmpY={20}
              friction={0.9}
              tension={0.03}
              maxCursorMove={60}
              xGap={18}
              yGap={48}
            />
          </div>
          <div className="relative z-10">
            {/* Hero */}
            <Hero darkMode={darkMode} />
            {/* About */}
            <section id="about" className="py-24 px-6 reveal">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h2 className={cx('text-3xl font-bold mb-4 font-mono flex items-center', darkMode ? 'text-white' : 'text-gray-900')}>
                $ whoami<span className="animate-blink ml-1 text-blue-500">_</span>
              </h2>
              <p className={cx('text-lg mb-4 leading-relaxed', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                Dynamic AI Research Engineer with a strong focus on reinforcement learning, computer vision, and applied research engineering. I bridge research ideas to reliable systems and enjoy working on problems at the intersection of learning algorithms and real-world robotics.
              </p>

              <div className={cx('p-4 rounded-lg text-sm border shadow-sm', darkMode ? 'bg-gray-900 border-gray-700' : 'bg-slate-100 border-slate-300')}>
                <div className={cx(darkMode ? 'text-green-400' : 'text-green-600')}>→ University of Khartoum</div>
                <div className={cx('ml-4', darkMode ? 'text-gray-400' : 'text-gray-600')}>B.Sc. Electrical & Electronics Engineering</div>
                <div className={cx('ml-4', darkMode ? 'text-blue-400' : 'text-blue-600')}>GPA: 8.91/10.0 — First Class Honours</div>
              </div>
            </div>

            <aside>
              <h3 className={cx('text-xl font-bold mb-4 font-mono', darkMode ? 'text-white' : 'text-gray-900')}>Recent Achievements</h3>
              <div className="space-y-3">
                {[{ icon: Award, text: 'Best Research Paper - ICOAI 2024, Dubai', year: '2024' }, { icon: Award, text: '40% cost reduction via RL agent', year: '2025' }, { icon: Award, text: 'Best Undergraduate Project (#1/49)', year: '2022' }, { icon: Award, text: 'Superhuman performance in medical document classification', year: '2025' }].map((it, i) => (
                  <div key={i} className={cx('flex items-start gap-3 p-3 rounded-lg transition-transform hover:-translate-y-0.5 hover:shadow-md border border-transparent', darkMode ? 'bg-gray-900/80 hover:border-gray-700' : 'bg-slate-100 hover:border-slate-300')}>
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
        </div>
        </div>

        {/* Publications */}
        <section id="publications" className="py-24 px-6 reveal">
          <div className="max-w-6xl mx-auto">
            <h2 className={cx('text-3xl font-bold mb-6 font-mono flex items-center', darkMode ? 'text-white' : 'text-gray-900')}>
              $ cat publications.txt<span className="animate-blink ml-1 text-blue-500">_</span>
            </h2>

            <div className="space-y-4">
              {PUBLICATIONS.map((p, idx) => (
                <article key={idx} className={cx('p-6 rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg', darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500/50 hover:shadow-blue-900/20' : 'bg-slate-50 border-slate-300 hover:border-blue-400/50 hover:shadow-blue-500/10')}>
                  <h3 className={cx('text-xl font-bold mb-1', darkMode ? 'text-white' : 'text-gray-900')}>{p.title}</h3>
                  <p className={cx('text-sm mb-3', darkMode ? 'text-gray-400' : 'text-gray-600')}>{p.authors}</p>

                  <div className="flex flex-wrap gap-3 items-center">
                    <span className={cx('font-mono text-sm', darkMode ? 'text-blue-400' : 'text-blue-600')}>{p.date}</span>

                    {p.doi && (
                      <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-1 text-sm underline transition-colors', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>
                        <ExternalLink size={14} /> DOI
                      </a>
                    )}

                    {p.arxiv && (
                      <a href={`https://arxiv.org/abs/${p.arxiv}`} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-1 text-sm underline transition-colors', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>
                        <ExternalLink size={14} /> arXiv
                      </a>
                    )}

                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-1 text-sm underline transition-colors', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>
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
        <section id="projects" className={cx('py-24 px-6 reveal', darkMode ? 'bg-gray-800/40' : 'bg-slate-100/90')}>
          <div className="max-w-6xl mx-auto">
            <h2 className={cx('text-3xl font-bold mb-6 font-mono flex items-center', darkMode ? 'text-white' : 'text-gray-900')}>
              $ ls -la projects/<span className="animate-blink ml-1 text-blue-500">_</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {PROJECTS.map((proj, i) => (
                <section key={i} className={cx('p-6 rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col', darkMode ? 'bg-gray-900 border-gray-700 hover:border-blue-500 hover:shadow-blue-900/20' : 'bg-slate-100 border-slate-300 hover:border-blue-400 hover:shadow-blue-500/10')}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={cx('text-xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{proj.title}</h3>
                    <time className={cx('font-mono text-xs', darkMode ? 'text-gray-500' : 'text-gray-500')}>{proj.date}</time>
                  </div>

                  <p className={cx('mb-4 text-sm leading-relaxed flex-grow', darkMode ? 'text-gray-400' : 'text-gray-600')}>{proj.description}</p>

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
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-2 text-sm underline transition-colors', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>
                        <Github size={16} /> Code
                      </a>
                    )}

                    {proj.video && (
                      <a href={proj.video} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-2 text-sm underline transition-colors', darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')}>
                        <Youtube size={16} /> Demo
                      </a>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* Blog */}
        <Blog darkMode={darkMode} />

        {/* Skills */}
        <section className="py-24 px-6 reveal">
          <div className="max-w-6xl mx-auto">
            <h2 className={cx('text-3xl font-bold mb-6 font-mono flex items-center', darkMode ? 'text-white' : 'text-gray-900')}>
              $ cat skills.json<span className="animate-blink ml-1 text-blue-500">_</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(SKILLS).map(([category, items], i) => (
                <div key={i} className={cx('p-6 rounded-lg border transition-all hover:shadow-md', darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-slate-50 border-slate-300 hover:border-gray-300')}>
                  <h3 className={cx('text-lg font-bold mb-4 font-mono', darkMode ? 'text-blue-400' : 'text-blue-600')}>{`${category}:`}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s, j) => (
                      <span key={j} className={cx('px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-default', darkMode ? 'bg-gray-900 text-gray-300 hover:bg-blue-900/30 hover:text-blue-300' : 'bg-slate-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700')}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Experience — Hyperspeed Tunnel */}
        <section className={cx('relative h-[500px] overflow-hidden', darkMode ? 'bg-black' : 'bg-slate-900')}>
          <div className="absolute inset-0 opacity-60">
            <Hyperspeed />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <p className={cx('font-mono text-2xl md:text-4xl font-bold', darkMode ? 'text-white/70' : 'text-white/60')}>
                $ ssh into-the-future
              </p>
              <p className="font-mono text-sm mt-2 text-blue-400/60">building what's next_</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className={cx('py-24 px-6 reveal relative overflow-hidden', darkMode ? 'bg-gray-900' : 'bg-slate-100')}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
            <LetterGlitch
              glitchSpeed={50}
              centerVignette={true}
              outerVignette={false}
              smooth={true}
              background={darkMode ? '#111827' : '#f1f5f9'}
              vignetteColor={darkMode ? '17,24,39' : '241,245,249'}
            />
          </div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 className={cx('text-3xl font-bold mb-4 font-mono flex items-center justify-center', darkMode ? 'text-white' : 'text-gray-900')}>
              $ contact --help<span className="animate-blink ml-1 text-blue-500">_</span>
            </h2>
            <p className={cx('text-lg mb-8 font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
              Interested in collaboration, research opportunities, or just want to connect?
            </p>

            {/* EmailJS Contact Form */}
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={cx('py-8 border-t font-mono text-sm flex flex-col items-center gap-2 bg-grid-pattern relative', darkMode ? 'bg-gray-900 border-gray-800 text-gray-500' : 'bg-slate-100 border-slate-300 text-gray-500')}>
        <div>© 2025 Mohammed Yousif.</div>
        <div>Built with <span className="text-blue-500 font-bold">React</span> & <span className="text-teal-400 font-bold">Tailwind CSS</span></div>
      </footer>
      
      {/* Chat Agent */}
      <ChatAgent darkMode={darkMode} />
    </div>
  );
}
