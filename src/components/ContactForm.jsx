import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_497oohc';
const TEMPLATE_ID = 'template_wo6mbmg';
const PUBLIC_KEY = 'oOnB22OuIw1qA8JGH';

const ContactForm = () => {
  const formRef = useRef();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Linter states
  const [errors, setErrors] = useState({ user_name: false, user_email: false });

  const validate = (name, value) => {
    if (name === 'user_email') {
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length > 0;
    }
    if (name === 'user_name') {
      return value.length > 0 && value.length < 2;
    }
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY })
      .then(() => {
        setStatus('success');
        setLoading(false);
        formRef.current.reset();
        setErrors({ user_name: false, user_email: false });
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setStatus('error');
        setLoading(false);
      });
  };

  return (
    <div className="max-w-xl w-full mx-auto rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden font-mono bg-slate-100 dark:bg-[#0d1117]">
      {/* VS Code Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-300 dark:bg-[#1f2428]">
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">contact_form.jsx</p>
        <div></div>
      </div>

      {/* Code-like Body */}
      <div className="p-6 bg-slate-200 dark:bg-[#0d1117] text-gray-800 dark:text-gray-100 relative">
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col space-y-4 pl-10 relative">
          {/* Fake Line Numbers */}
          <div className="absolute left-2 top-2 text-gray-400 text-sm select-none">
            {[...Array(14)].map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <label className="text-blue-500">const ContactForm = () =&gt; {'{'}</label>

          <div className="relative">
            <input
              type="text"
              name="user_name"
              placeholder="  name = 'Your Name';"
              onChange={handleInputChange}
              className={`w-full bg-transparent border-b border-gray-400 dark:border-gray-600 focus:border-blue-500 focus:shadow-[0_1px_0_rgba(59,130,246,0.5)] transition-shadow text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-500 dark:placeholder-gray-600 ${errors.user_name ? 'linter-error' : ''}`}
              required
            />
            {errors.user_name && (
              <span className="absolute -top-6 left-0 text-[10px] text-red-500 bg-red-100 dark:bg-red-900/30 px-1 rounded">
                {"//"} Syntax Error: Name too short
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="email"
              name="user_email"
              placeholder="  email = 'your@email.com';"
              onChange={handleInputChange}
              className={`w-full bg-transparent border-b border-gray-400 dark:border-gray-600 focus:border-blue-500 focus:shadow-[0_1px_0_rgba(59,130,246,0.5)] transition-shadow text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-500 dark:placeholder-gray-600 ${errors.user_email ? 'linter-error' : ''}`}
              required
            />
            {errors.user_email && (
              <span className="absolute -top-6 left-0 text-[10px] text-red-500 bg-red-100 dark:bg-red-900/30 px-1 rounded">
                {"//"} Syntax Error: Invalid email format
              </span>
            )}
          </div>

          <textarea
            name="message"
            rows="4"
            placeholder="  message = 'Type your message here...';"
            className="bg-transparent border-b border-gray-400 dark:border-gray-600 focus:border-blue-500 focus:shadow-[0_1px_0_rgba(59,130,246,0.5)] transition-shadow text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-500 dark:placeholder-gray-600 resize-none"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200 border shadow-sm ${
              loading
                ? 'border-blue-400 text-blue-400 cursor-wait'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-blue-500/30'
            }`}
          >
            {loading ? 'sending()...' : 'sendMessage();'}
          </button>

          {status === 'success' && (
            <p className="text-green-500 dark:text-green-400 mt-2">
              {"// Message sent successfully ✓"}
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-500 dark:text-red-400 mt-2">
              {"// Error sending message ✗"}
            </p>
          )}

          <p className="text-blue-500">{'};'}</p>
        </form>

        {/* Blinking Cursor */}
        <div className="absolute bottom-3 left-8 w-2 h-4 bg-blue-400 animate-blink"></div>
      </div>
    </div>
  );
};

export default ContactForm;
