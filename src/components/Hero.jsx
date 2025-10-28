import React, { useEffect, useState } from 'react';
import { Github, Linkedin, BookOpen, FileText } from 'lucide-react';

const cx = (...args) => args.filter(Boolean).join(' ');

const NAME = 'Mohammed Yousif';
const TITLE = 'AI Research Engineer — Reinforcement Learning · Computer Vision · Autonomous Systems';
const LOCATION = 'Abu Dhabi, UAE';
const EMAIL = 'mohammed.yah.yousif@gmail.com';
const IMAGE_SRC = '/profile.jpg';

const SOCIALS = [
  { href: 'https://github.com/mohammed-tech-innovator', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/mohammed-yousif-86208b245/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://scholar.google.com/citations?user=27RB04gAAAAJ', icon: BookOpen, label: 'Scholar' },
  { href: 'https://scholar.google.com/citations?user=27RB04gAAAAJ', icon: FileText, label: 'Résumé' }
];

const CODE_LINES = [
  `const researcher = {`,
  `  name: "${NAME}",`,
  `  role: "AI Research Engineer",`,
  `  focus: ["Reinforcement Learning", "Computer Vision", "Autonomous Systems"],`,
  `  location: "${LOCATION}",`,
  `  email: "${EMAIL}",`,
  `};`,
  ``,
  `// run: npm run research --fast`,
];

const TECH = ['PyTorch', 'OpenCV', 'PPO', 'NumPy', 'HuggingFace', 'GCP', 'TensorFlow', 'VertexAI'];

function useTyping(lines, speed = 25, lineDelay = 500) {
  const [displayed, setDisplayed] = useState(lines.map(() => ''));

  useEffect(() => {
    let mounted = true;
    let charIdx = 0;

    function typeLine(lineIndex) {
      if (!mounted) return;
      const line = lines[lineIndex] || '';
      const interval = setInterval(() => {
        if (!mounted) return clearInterval(interval);
        if (charIdx <= line.length) {
          setDisplayed(prev => {
            const copy = [...prev];
            copy[lineIndex] = line.slice(0, charIdx);
            return copy;
          });
          charIdx += 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            charIdx = 0;
            const next = lineIndex + 1;
            if (next < lines.length) typeLine(next);
          }, lineDelay);
        }
      }, speed);
    }

    typeLine(0);
    return () => { mounted = false; };
  }, [lines, speed, lineDelay]);

  return { displayed };
}

export default function HeroCodey({ darkMode = false }) {
  const { displayed } = useTyping(CODE_LINES, 22, 300);

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">

        {/* Avatar */}
        <div className="flex flex-col items-center md:items-start gap-6">
          <div
            className={cx(
              'relative rounded-lg p-1 shadow-xl',
              darkMode ? 'bg-gradient-to-tr from-blue-600/40 via-purple-600/30 to-pink-500/20' : 'bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-100'
            )}
          >
            <img
              src={IMAGE_SRC}
              alt={NAME}
              className="w-48 h-48 md:w-64 md:h-64 rounded-lg object-cover bg-gray-200"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className={cx('text-center md:text-left')}> 
            <h1 className={cx('text-3xl md:text-4xl font-bold font-mono', darkMode ? 'text-white' : 'text-gray-900')}>{NAME}</h1>
            <p className={cx('mt-1 text-sm md:text-base font-mono', darkMode ? 'text-gray-300' : 'text-gray-600')}>{TITLE}</p>

            <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={cx('flex items-center gap-2 text-sm font-mono underline hover:opacity-80 transition-opacity', darkMode ? 'text-gray-200' : 'text-gray-800')}
                >
                  <Icon className="w-4 h-4" /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal / code card */}
        <div>
          <div className={cx('rounded-xl overflow-hidden shadow-lg font-mono', darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200')}>
            <div className={cx('flex items-center gap-2 px-4 py-2', darkMode ? 'bg-gray-800' : 'bg-gray-100')}>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 text-xs text-gray-500">~/portfolio/hero.jsx</div>
            </div>

            <div className={cx('p-6', darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-slate-50 to-white')}>
              <pre className={cx('text-sm leading-relaxed whitespace-pre-wrap break-words', darkMode ? 'text-green-300' : 'text-sky-700')}> 
                {displayed.map((line, idx) => (
                  <div key={idx}>
                    <span dangerouslySetInnerHTML={{ __html: escapeHtml(line) }} />
                    {idx === displayed.length - 1 ? <span className="blinking-cursor">█</span> : null}
                  </div>
                ))}
              </pre>

              <div className="mt-4 flex flex-wrap gap-2">
                {TECH.map((t, i) => (
                  <span key={i} className={cx('text-xs px-2 py-1 rounded font-mono border', darkMode ? 'bg-gray-800 border-gray-700 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-700')}>&lt;{t} /&gt;</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .blinking-cursor { display: inline-block; margin-left: 2px; animation: blink 1s steps(2, start) infinite; }
        @keyframes blink { to { visibility: hidden; } }
      `}</style>
    </section>
  );
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
