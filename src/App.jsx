import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Palette, Camera, Film, Image as ImageIcon, Plus, Trash2, Settings, Eye, LogIn, Save, X, Move, Maximize, Lock, User, AlertCircle } from 'lucide-react';

// --- Custom Discord Icon ---
const DiscordIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
  </svg>
);

// --- Background Component ---
const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let particles = [];
    let bolts = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedY = Math.random() * 0.7 + 0.2;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > canvas.height) { this.y = -10; this.x = Math.random() * canvas.width; }
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Bolt {
      constructor() {
        this.path = [];
        this.segments = 20;
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.life = 1;
        this.generatePath();
      }
      generatePath() {
        let curX = this.x;
        let curY = this.y;
        this.path.push({x: curX, y: curY});
        for (let i = 0; i < this.segments; i++) {
          curX += (Math.random() - 0.5) * 60;
          curY += (canvas.height / this.segments);
          this.path.push({x: curX, y: curY});
          if (Math.random() > 0.95) {
            this.path.push("branch");
            this.path.push({x: curX + (Math.random() - 0.5) * 40, y: curY + 20});
          }
        }
      }
      update() { this.life -= 0.03; }
      draw() {
        if (this.life <= 0) return;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.15})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
          if (this.path[i] === "branch") {
             ctx.stroke(); ctx.beginPath(); ctx.moveTo(this.path[i-1].x, this.path[i-1].y);
             i++; if (this.path[i]) ctx.lineTo(this.path[i].x, this.path[i].y);
          } else { ctx.lineTo(this.path[i].x, this.path[i].y); }
        }
        ctx.stroke(); ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = Array.from({ length: 120 }, () => new Particle());
    };

    const animate = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (Math.random() > 0.996 && bolts.length < 2) bolts.push(new Bolt());
      bolts = bolts.filter(b => b.life > 0);
      bolts.forEach(b => { b.update(); b.draw(); });
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize(); init(); animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- Portfolio Grid Item ---
const PortfolioItem = ({ item, categoryId }) => (
  <div className={`group relative ${categoryId === 'banners' ? 'aspect-[16/5] sm:col-span-2 lg:col-span-3' : 'aspect-square'} bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden cursor-pointer transform-gpu transition-all duration-500 ease-out hover:border-white/40 hover:scale-[1.01] hover:shadow-2xl hover:shadow-white/5`}>
    {item.image ? (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title}
          className="max-w-none transition-transform duration-700 group-hover:brightness-110"
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `scale(${item.scale || 1}) translate(${item.offsetX || 0}%, ${item.offsetY || 0}%)`
          }}
        />
      </div>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-white/5 transform-gpu group-hover:text-white/20 transition-all duration-700 ease-out">
          <ImageIcon size={categoryId === 'banners' ? 48 : 80} strokeWidth={0.5} />
        </div>
      </div>
    )}

    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none flex flex-col justify-end p-8">
      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <p className="text-white font-black text-xl tracking-tight uppercase">{item.title}</p>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">View Production</p>
      </div>
    </div>
  </div>
);

export default function App() {
  // --- PASTE YOUR DISCORD INVITE LINK BELOW ---
  const DISCORD_LINK = "https://discord.gg/nXthZ5qywN"; 

  const [view, setView] = useState('portfolio'); // 'portfolio', 'login', 'admin'
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Persistent Data State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('quantm_projects_v5');
    return saved ? JSON.parse(saved) : {
      pfp: [{ id: 1, title: 'Identity v1', image: '', scale: 1, offsetX: 0, offsetY: 0 }],
      banners: [{ id: 2, title: 'Cinema Header', image: '', scale: 1, offsetX: 0, offsetY: 0 }],
      vfx: [{ id: 3, title: 'Motion Spike', image: '', scale: 1, offsetX: 0, offsetY: 0 }],
      gfx: [{ id: 4, title: 'Brand Core', image: '', scale: 1, offsetX: 0, offsetY: 0 }]
    };
  });

  useEffect(() => {
    localStorage.setItem('quantm_projects_v5', JSON.stringify(projects));
  }, [projects]);

  const sections = [
    { id: 'pfp', title: 'PFP', icon: <Camera size={18} />, description: 'High-impact profile identifiers.' },
    { id: 'banners', title: 'BANNERS', icon: <Palette size={18} />, description: 'Cinematic headers & landscape branding.' },
    { id: 'vfx', title: 'VFX', icon: <Film size={18} />, description: 'Motion-driven visual storytelling.' },
    { id: 'gfx', title: 'GFX', icon: <ImageIcon size={18} />, description: 'Premium static brand assets.' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      const threshold = 200; 
      let current = 'hero';
      sections.forEach(s => {
        const element = document.getElementById(s.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top + scrollY - threshold <= scrollY) current = s.id;
        }
      });
      setActiveSection(current);
    };

    let timeout;
    const handleMouseMove = (e) => {
      if (timeout) cancelAnimationFrame(timeout);
      timeout = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 15,
          y: (e.clientY / window.innerHeight - 0.5) * 15
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const targetOffset = 120;
      const rect = element.getBoundingClientRect();
      const targetPosition = rect.top + window.scrollY - targetOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  // --- Login Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === 'clipzzxx123@gmail.com' && loginPassword === '092311Kbs') {
      setView('admin');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Access denied.');
    }
  };

  // --- Admin Logic ---
  const [adminTab, setAdminTab] = useState('pfp');
  
  const handleAddProject = (category) => {
    const newProj = { id: Date.now(), title: 'New Concept', image: '', scale: 1, offsetX: 0, offsetY: 0 };
    setProjects(prev => ({ ...prev, [category]: [...prev[category], newProj] }));
  };

  const handleUpdateProject = (category, id, field, value) => {
    setProjects(prev => ({
      ...prev,
      [category]: prev[category].map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleRemoveProject = (category, id) => {
    setProjects(prev => ({ ...prev, [category]: prev[category].filter(p => p.id !== id) }));
  };

  const handleImageUpload = (category, id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { handleUpdateProject(category, id, 'image', reader.result); };
      reader.readAsDataURL(file);
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6 selection:bg-white selection:text-black antialiased">
        <AnimatedBackground />
        <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl relative z-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-6 border border-white/10">
              <Lock size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">QUANTM ACCESS</h1>
            <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">Authorized Entry Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase ml-1">Email Identifier</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white">
                  <User size={16} />
                </div>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-white/30 transition-all placeholder:text-zinc-700" 
                  placeholder="Enter secure email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase ml-1">Key Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-white/30 transition-all placeholder:text-zinc-700" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <AlertCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-white text-black py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5 mt-4"
            >
              AUTHENTICATE
            </button>
          </form>

          <button 
            onClick={() => setView('portfolio')}
            className="w-full mt-6 text-[10px] font-black text-zinc-600 hover:text-white transition-colors tracking-widest uppercase"
          >
            RETURN TO SITE
          </button>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans p-8 selection:bg-white selection:text-black antialiased">
        <AnimatedBackground />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter">ADMIN CENTER</h1>
              <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2">Inventory Management</p>
            </div>
            <button onClick={() => setView('portfolio')} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black text-xs hover:bg-zinc-200 transition-all shadow-xl">
              <Eye size={16} /> VIEW LIVE SITE
            </button>
          </header>

          <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
            {sections.map(s => (
              <button key={s.id} onClick={() => setAdminTab(s.id)} className={`min-w-[120px] flex-1 py-4 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase transition-all border ${adminTab === s.id ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20'}`}>
                {s.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {projects[adminTab].map((p) => (
              <div key={p.id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col gap-8 items-start group">
                <div className="flex flex-col lg:flex-row w-full gap-10">
                  <div className={`w-full lg:w-80 ${adminTab === 'banners' ? 'aspect-[16/5]' : 'aspect-square'} rounded-xl bg-black border border-white/5 overflow-hidden flex-shrink-0 relative group flex items-center justify-center`}>
                    {p.image ? (
                      <img src={p.image} className="max-w-none" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${p.scale}) translate(${p.offsetX}%, ${p.offsetY}%)` }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-800"><ImageIcon size={32} /></div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer text-white font-black text-[10px] tracking-widest uppercase">
                        IMPORT IMAGE
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(adminTab, p.id, e)} />
                      </label>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 mr-4">
                        <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase block mb-2">Project Label</label>
                        <input value={p.title} onChange={(e) => handleUpdateProject(adminTab, p.id, 'title', e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 w-full font-bold text-white outline-none focus:border-white/30 transition-all" />
                      </div>
                      <button onClick={() => handleRemoveProject(adminTab, p.id)} className="mt-6 p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Fit (Scale)</label>
                          <span className="text-white text-[10px] font-bold">{p.scale}x</span>
                        </div>
                        <input type="range" min="0.1" max="5" style={{width: '100%'}} step="0.05" value={p.scale} onChange={(e) => handleUpdateProject(adminTab, p.id, 'scale', parseFloat(e.target.value))} className="h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Center X</label>
                          <span className="text-white text-[10px] font-bold">{p.offsetX}%</span>
                        </div>
                        <input type="range" min="-150" max="150" style={{width: '100%'}} step="1" value={p.offsetX} onChange={(e) => handleUpdateProject(adminTab, p.id, 'offsetX', parseInt(e.target.value))} className="h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Center Y</label>
                          <span className="text-white text-[10px] font-bold">{p.offsetY}%</span>
                        </div>
                        <input type="range" min="-150" max="150" style={{width: '100%'}} step="1" value={p.offsetY} onChange={(e) => handleUpdateProject(adminTab, p.id, 'offsetY', parseInt(e.target.value))} className="h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => handleAddProject(adminTab)} className="w-full py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 text-zinc-700 hover:text-white hover:border-white/20 transition-all group">
              <Plus size={40} className="group-hover:scale-110 transition-transform" />
              <span className="font-black text-[10px] tracking-[0.5em] uppercase">Create {adminTab} Slot</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white selection:text-black bg-black antialiased overflow-x-hidden scroll-smooth">
      <AnimatedBackground />

      <div className={`fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-8 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        {sections.map(s => (
          <button key={s.id} className="flex items-center gap-4 group outline-none" onClick={(e) => scrollToSection(e, s.id)}>
            <div className={`h-1 transition-all duration-500 rounded-full ${activeSection === s.id ? 'w-8 bg-white' : 'w-4 bg-white/20 group-hover:bg-white/40'}`}></div>
            <span className={`text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 ${activeSection === s.id ? 'text-white translate-x-0' : 'text-white/20 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.title}
            </span>
          </button>
        ))}
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-8 py-6 ${scrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button className="text-2xl font-black tracking-tighter cursor-pointer group outline-none" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            QUANTM<span className="text-white/20 group-hover:text-white transition-colors duration-500">.</span>
          </button>
          
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex gap-10 text-[10px] font-black tracking-[0.4em]">
              {sections.map(s => (
                <button key={s.id} onClick={(e) => scrollToSection(e, s.id)} className={`transition-all duration-300 uppercase outline-none ${activeSection === s.id ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>{s.title}</button>
              ))}
            </div>
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-full font-black text-[11px] hover:bg-zinc-200 transition-all duration-300 active:scale-95 shadow-xl shadow-white/5">
              <DiscordIcon size={16} />
              <span className="tracking-[0.1em]">DISCORD</span>
            </a>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="z-10 transform-gpu transition-transform duration-700 ease-out will-change-transform" style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-white/20"></div>
            <h2 className="text-white/40 font-bold tracking-[0.6em] uppercase text-[9px]">Established MMXXVI</h2>
            <div className="h-px w-12 bg-white/20"></div>
          </div>
          <h1 className="text-[12vw] md:text-9xl font-black mb-10 leading-none select-none px-4">
            <span className="block tracking-tighter mb-2">QUANTM</span>
            <span className="inline-block tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 pr-4">STUDIOS</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-6">
            <button onClick={() => scrollToSection(null, 'pfp')} className="bg-white text-black px-12 py-4 rounded-full font-black text-[11px] tracking-[0.2em] hover:scale-105 transition-transform duration-300 shadow-2xl shadow-white/10">VIEW SHOWREEL</button>
            <button className="bg-transparent border border-white/10 px-12 py-4 rounded-full font-black text-[11px] tracking-[0.2em] hover:bg-white/5 hover:border-white/30 transition-all duration-300">GET IN TOUCH</button>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20"><div className="w-px h-16 bg-gradient-to-b from-white to-transparent"></div></div>
      </section>

      <main className="max-w-7xl mx-auto px-8 pb-40 space-y-56 relative z-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-xl space-y-4">
                <h3 className="text-6xl font-black tracking-tight">{section.title}</h3>
                <p className="text-zinc-500 text-lg leading-relaxed font-medium">{section.description}</p>
              </div>
              <button className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-white/20 hover:text-white transition-all duration-500 group border-b border-white/10 pb-3">EXPLORE PROJECTS <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects[section.id].map((item) => (
                <PortfolioItem key={item.id} item={item} categoryId={section.id} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-white/5 py-32 px-8 bg-[#020202] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-16">
          <div className="space-y-6">
            <div className="text-6xl font-black tracking-tighter">QUANTM<span className="text-white/20">.</span></div>
            <p className="text-zinc-600 text-[11px] tracking-[0.5em] uppercase font-black">Visual Excellence Redefined</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            <button className="text-[11px] font-black tracking-[0.3em] text-zinc-500 hover:text-white transition-all duration-300 uppercase relative group">YouTube</button>
            <button onClick={() => setView('login')} className="text-[11px] font-black tracking-[0.3em] text-zinc-800 hover:text-white transition-all duration-300 uppercase relative group">ADMIN ACCESS</button>
          </div>
          <div className="pt-16 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-700 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span>© 2026 QUANTM STUDIOS</span>
            <div className="flex gap-10">
              <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}