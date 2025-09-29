import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MatrixLogin = ({ onLogin, onClose }) => {
  const [stage, setStage] = useState('loading'); // loading, username, password, success, denied
  const [currentText, setCurrentText] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  const digitalMarketingFacts = [
    'AI-powered chatbots handle 85% of customer interactions without human intervention',
    'Personalized email campaigns driven by AI see 760% increase in revenue',
    'Machine learning algorithms can predict customer lifetime value with 95% accuracy',
    'AI content generation tools produce 300% more content in half the time',
    'Programmatic advertising powered by AI reaches the right audience 87% more effectively',
    'Voice search optimization is crucial as 58% of consumers use voice search daily',
    'AI-driven dynamic pricing increases profits by up to 25% in real-time',
    'Predictive analytics help marketers identify high-value leads 3x faster',
    'Computer vision AI can analyze brand sentiment from social media images',
    'Neural networks process 2.5 quintillion bytes of marketing data daily',
    'AI recommendation engines drive 35% of Amazon\'s total revenue',
    'Marketing automation with AI increases qualified leads by 451%',
    'Real-time personalization powered by AI boosts conversion rates by 202%',
    'AI fraud detection prevents $28 billion in ad spend waste annually',
    'Sentiment analysis AI processes 500 million social posts per day'
  ];

  const getRandomFact = () => {
    return digitalMarketingFacts[Math.floor(Math.random() * digitalMarketingFacts.length)];
  };

  const matrixLines = [
    'INITIALIZING SECURE CONNECTION...',
    'BYPASSING FIREWALL...',
    'ACCESSING DISRUPTORS NEURAL NETWORK...',
    'CONNECTION ESTABLISHED',
    '',
    `DID YOU KNOW: ${getRandomFact()}`,
    '',
    'WELCOME TO THE SYSTEM',
    '',
    'STATE YOUR IDENTITY:'
  ];

  const typewriterSpeed = 3;
  const cursorBlinkSpeed = 500;

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, cursorBlinkSpeed);
    return () => clearInterval(interval);
  }, []);

  // Initial matrix loading sequence
  useEffect(() => {
    if (stage === 'loading') {
      let lineIndex = 0;
      let charIndex = 0;
      let fullText = '';

      const typeMatrix = () => {
        if (lineIndex < matrixLines.length) {
          const currentLine = matrixLines[lineIndex];

          if (charIndex < currentLine.length) {
            fullText += currentLine[charIndex];
            setCurrentText(fullText);
            charIndex++;
            setTimeout(typeMatrix, typewriterSpeed);
          } else {
            fullText += '\n';
            setCurrentText(fullText);
            lineIndex++;
            charIndex = 0;
            setTimeout(typeMatrix, lineIndex === matrixLines.length - 1 ? 1000 : 200);
          }
        } else {
          setStage('username');
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 100);
        }
      };

      setTimeout(typeMatrix, 1000);
    }
  }, [stage]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentText(prev => prev + username + '\n\nACCESS VERIFICATION REQUIRED\nENTER AUTHORIZATION CODE:\n');
      setStage('password');
      setUsername(username.trim());
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password === 'DMadmin') {
      setCurrentText(prev => prev + '•'.repeat(password.length) + '\n\nACCESS GRANTED\nCREATING SECURE SESSION...\n');
      setStage('success');

      try {
        // Create admin session in Supabase (dynamically import for code splitting)
        const { supabaseMediaStorage } = await import('@/lib/supabase-media-storage');
        const sessionData = await supabaseMediaStorage.createAdminSession(
          username,
          null, // IP will be detected server-side
          navigator.userAgent
        );

        setCurrentText(prev => prev + 'SESSION ESTABLISHED\nWELCOME TO THE SYSTEM, ' + username.toUpperCase() + '\nINITIALIZING ADMIN INTERFACE...\n');

        setTimeout(() => {
          onLogin(username, sessionData);
        }, 2000);

      } catch (error) {
        console.error('Failed to create admin session:', error);
        setCurrentText(prev => prev + 'SESSION ERROR\nFALLBACK AUTHENTICATION ACTIVE\nINITIALIZING ADMIN INTERFACE...\n');

        setTimeout(() => {
          onLogin(username, null); // Login without session
        }, 2000);
      }
    } else {
      setCurrentText(prev => prev + '•'.repeat(password.length) + '\n\nACCESS DENIED\nINVALID AUTHORIZATION CODE\n\nCONNECTION TERMINATED\n');
      setStage('denied');
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Matrix Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        src="https://res.cloudinary.com/dvcvxhzmt/video/upload/v1757365266/assets_task_01k4g57bxeexgsha3x1c57d59s_task_01k4g57bxeexgsha3x1c57d59s_genid_4adb2a22-6ea4-403f-9282-517e81f0bd71_25_09_06_18_40_547085_videos_00000_250420923_source_jgmbpy.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
      />

      {/* Retro CRT Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-green-900/3 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-900/2 to-transparent animate-pulse"></div>
      </div>

      {/* Scanlines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)',
          animation: 'scanlines 0.1s linear infinite'
        }}
      ></div>

      {/* Audio Controls */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 border border-green-400 text-green-400 hover:bg-green-400/20 transition-colors rounded"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 p-2 bg-black/50 border border-red-400 text-red-400 hover:bg-red-400/20 transition-colors rounded text-xs font-mono"
      >
        ESC
      </button>

      {/* Terminal Interface */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-4xl bg-black/60 border border-green-400 rounded-lg shadow-2xl shadow-green-400/20 backdrop-blur-sm">

          {/* Terminal Header */}
          <div className="flex items-center justify-between p-4 border-b border-green-400/30 bg-green-400/10">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-green-400 text-sm font-mono">DISRUPTORS_NEURAL_NET v2.1.4</div>
            <div className="text-green-400/60 text-xs font-mono">SECURE_CHANNEL</div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 min-h-[500px] font-mono text-green-400 bg-black/70">

            {/* Matrix Output */}
            <div className="whitespace-pre-wrap leading-relaxed text-sm">
              {currentText}
            </div>

            {/* Input Section */}
            {stage === 'username' && (
              <form onSubmit={handleUsernameSubmit} className="mt-4">
                <div className="flex items-center">
                  <span className="text-green-400">{'>'} </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent border-none outline-none text-green-400 font-mono flex-1 ml-2"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={20}
                  />
                  {showCursor && <span className="text-green-400 animate-pulse">█</span>}
                </div>
              </form>
            )}

            {stage === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="mt-4">
                <div className="flex items-center">
                  <span className="text-green-400">{'>'} </span>
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-none outline-none text-green-400 font-mono flex-1 ml-2"
                    autoComplete="off"
                    spellCheck="false"
                    style={{ WebkitTextSecurity: 'disc' }}
                  />
                  {showCursor && <span className="text-green-400 animate-pulse">█</span>}
                </div>
              </form>
            )}

            {(stage === 'loading' || stage === 'success') && showCursor && (
              <span className="text-green-400 animate-pulse">█</span>
            )}

          </div>

          {/* Terminal Footer */}
          <div className="px-6 py-3 border-t border-green-400/30 bg-green-400/5 text-xs font-mono text-green-400/60 flex justify-between">
            <span>ENCRYPTED CONNECTION ACTIVE</span>
            <span>NEURAL_LINK: STABLE</span>
            <span>UPTIME: {new Date().toLocaleTimeString()}</span>
          </div>

        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        /* CRT Glow Effect */
        .terminal-glow {
          box-shadow:
            0 0 20px #00ff00,
            inset 0 0 20px #00ff0030,
            0 0 40px #00ff0020;
        }

        /* Matrix Rain Effect - could be added later */
        .matrix-rain {
          background: linear-gradient(transparent, #00ff00, transparent);
          animation: rain 3s linear infinite;
        }

        @keyframes rain {
          to { transform: translateY(100vh); }
        }

        /* Retro Phosphor Glow */
        input {
          text-shadow: 0 0 5px #00ff00;
        }
      `}</style>
    </div>
  );
};

export default MatrixLogin;