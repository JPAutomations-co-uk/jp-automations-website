"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import {
  Play, Zap, CheckCircle2, XCircle, Search,
  BarChart3, Star, Plus, Minus, ArrowRight,
  Clock, Image, Film, Type, CalendarDays, Megaphone,
  Layers, Sparkles, Camera
} from 'lucide-react';

// --- GLOBAL CONFIG & PHYSICS ---
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease },
  viewport: { once: true, margin: "-100px" }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease },
  viewport: { once: true, margin: "-100px" }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  viewport: { once: true, margin: "-100px" }
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease }
};

const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = Math.max(duration / end, 10);
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// --- FLOATING PARTICLES ---
const FloatingParticles = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-teal-400/20"
        initial={{
          x: `${Math.random() * 100}vw`,
          y: `${Math.random() * 100}vh`,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
          x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: Math.random() * 15 + 15,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10,
        }}
      />
    ))}
  </div>
);

// --- PULSING PLAY BUTTON ---
const PulsingPlayButton = ({ size = 'lg' }: { size?: 'sm' | 'lg' }) => {
  const dim = size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';
  const iconDim = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  return (
    <div className="relative">
      <motion.div
        className={`absolute inset-0 ${dim} rounded-full bg-teal-400/20`}
        animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        style={{ margin: 'auto', inset: 0, position: 'absolute' }}
      />
      <motion.div
        className={`absolute inset-0 ${dim} rounded-full bg-teal-400/15`}
        animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        style={{ margin: 'auto', inset: 0, position: 'absolute' }}
      />
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className={`${dim} bg-teal-400 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(45,212,191,0.4)] relative z-10 cursor-pointer`}
      >
        <Play className={`${iconDim} text-black ml-1.5`} fill="currentColor" />
      </motion.button>
    </div>
  );
};

// --- GLOW CARD WRAPPER ---
const GlowCard = ({ children, className = '', glowColor = 'teal' }: { children: React.ReactNode; className?: string; glowColor?: string }) => {
  const colors: Record<string, string> = {
    teal: 'hover:shadow-[0_0_30px_rgba(45,212,191,0.08)]',
    red: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]',
  };
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${className} ${colors[glowColor] || colors.teal} transition-all duration-300`}
    >
      {children}
    </motion.div>
  );
};

// --- DATA ---
const contentTypes = [
  { name: "AI Reels", desc: "Script, storyboard, and generate short-form video reels tailored to your niche and brand style.", tokens: 15, icon: Film },
  { name: "Carousel Posts", desc: "7-slide carousels generated from a single topic — designed for saves, shares, and reach.", tokens: 10, icon: Layers },
  { name: "Single Images", desc: "Branded AI-generated images in any aspect ratio — square, portrait, story, or landscape.", tokens: 5, icon: Image },
  { name: "Captions", desc: "Scroll-stopping captions with hooks, hashtags, and calls to action matched to the post.", tokens: 1, icon: Type },
  { name: "Content Plans", desc: "A full month of planned content — topics, formats, posting schedule, and funnel strategy.", tokens: 25, icon: CalendarDays },
  { name: "Ad Creatives", desc: "Meta-ready ad images and copy for paid campaigns — single images or carousels.", tokens: 10, icon: Megaphone },
];

const testimonials = [
  { name: "Sarah K.", role: "Beauty Salon Owner", text: "I used to spend 6 hours a week on content. Now it\u2019s 20 minutes. The carousels alone tripled my saves.", avatar: "SK" },
  { name: "Marcus T.", role: "Fitness Coach", text: "The reels are genuinely better than what my freelancer was producing. And they cost a fraction of the price.", avatar: "MT" },
  { name: "Elena R.", role: "Interior Designer", text: "My engagement doubled in the first month. The AI actually understands my brand aesthetic.", avatar: "ER" },
  { name: "David L.", role: "Accountant", text: "I never posted on Instagram before. Now I\u2019m putting out 4 carousels a week and getting inbound leads.", avatar: "DL" },
  { name: "Priya M.", role: "Wedding Planner", text: "The content plans are like having a strategist on retainer. Every month is mapped out perfectly.", avatar: "PM" },
  { name: "James H.", role: "Roofing Contractor", text: "I showed my wife and she thought I\u2019d hired an agency. It\u2019s just the AI engine.", avatar: "JH" },
];

const faqs = [
  { q: "Do I need design experience?", a: "No. The entire process is prompt-based. Describe what you want in plain English and the AI generates the content." },
  { q: "What aspect ratios are supported?", a: "Square (1:1), portrait (4:5), story/reel (9:16), and landscape (16:9) — all standard Instagram formats." },
  { q: "Can I use my own brand colours and style?", a: "Yes. During onboarding you define your brand style, and all generated content will reflect it consistently." },
  { q: "How long does generation take?", a: "Single images take 10\u201320 seconds. 7-slide carousels take 30\u201360 seconds. Reels take 1\u20132 minutes." },
  { q: "Do tokens expire?", a: "No. Tokens never expire and work across all apps — Instagram, SEO Blog, and every new app we release." },
  { q: "Is this a monthly subscription?", a: "No. You buy tokens when you need them. Pay-as-you-go at \u00A30.50/token, or save with a bundle. No contracts, no commitments." },
];

// --- INTRO TRANSITION ---
const IntroTransition = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'logo' | 'wipe' | 'done'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('wipe'), 2200);
    const t2 = setTimeout(() => { setPhase('done'); onComplete(); }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      animate={{ opacity: phase === 'wipe' ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(45,212,191,0.4)]"
        >
          <Camera className="w-8 h-8 text-black" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white tracking-tight text-center mb-4"
        >
          Instagram Content Engine
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-gray-500 text-sm tracking-widest uppercase"
        >
          by JP Automations
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.3, duration: 0.8, ease }}
          className="w-24 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent mt-6"
        />
      </motion.div>
    </motion.div>
  );
};

// --- PRE-HERO TEXT SEQUENCE ---
const PreHero = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2400);
    const t3 = setTimeout(() => setStep(3), 3600);
    const t4 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 3 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-4"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="text-3xl md:text-5xl font-bold text-white tracking-tight text-center relative z-10">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.span key="1" initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }} transition={{ duration: 0.5 }}>
                  You can&apos;t <span className="text-teal-400">grow</span>
                </motion.span>
              )}
              {step === 1 && (
                <motion.span key="2" initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }} transition={{ duration: 0.5 }}>
                  without <span className="text-teal-400">content.</span>
                </motion.span>
              )}
              {step === 2 && (
                <motion.span key="3" initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }} transition={{ duration: 0.5 }}>
                  Now you don&apos;t have to <span className="text-teal-400">create it.</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- NAVBAR ---
const Navbar = ({ startAnim }: { startAnim: boolean }) => (
  <motion.nav
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: startAnim ? 0 : -100, opacity: startAnim ? 1 : 0 }}
    transition={{ delay: 0.2, type: 'spring', stiffness: 80, damping: 15 }}
    className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-[800px] bg-white/[0.03] backdrop-blur-xl text-white rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row items-center gap-6 justify-between border border-white/[0.06] z-50"
  >
    <motion.a href="/" whileHover={{ scale: 1.05 }} className="font-bold text-lg tracking-tight cursor-pointer flex items-center gap-2">
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-7 h-7 rounded-lg bg-teal-400 flex items-center justify-center"
      >
        <Camera className="w-4 h-4 text-black" />
      </motion.div>
      <span className="text-white">Insta<span className="text-teal-400">Engine</span></span>
    </motion.a>
    <span className="hidden md:block w-px h-6 bg-white/10" />
    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
      {['Features', 'Pricing', 'FAQ'].map(item => (
        <motion.span key={item} whileHover={{ color: '#fff', y: -1 }} className="cursor-pointer transition-colors">{item}</motion.span>
      ))}
    </div>
    <motion.a
      href="/apply"
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(45,212,191,0.3)' }}
      whileTap={{ scale: 0.97 }}
      className="w-full md:w-auto bg-teal-400 hover:bg-teal-300 text-black font-semibold py-2 px-6 rounded-lg transition-colors whitespace-nowrap text-center"
    >
      Join Waitlist
    </motion.a>
  </motion.nav>
);

// --- HERO ---
const HeroSection = ({ startAnim }: { startAnim: boolean }) => (
  <section className="pt-32 pb-20 px-4 max-w-5xl mx-auto text-center relative">
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500 blur-[120px] rounded-full pointer-events-none"
    />

    <motion.div variants={staggerContainer} initial="initial" animate={startAnim ? "whileInView" : "initial"} className="flex flex-col items-center relative z-10">
      <motion.div
        variants={staggerItem}
        whileHover={{ scale: 1.05, borderColor: 'rgba(45,212,191,0.3)' }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8 cursor-default"
      >
        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-300">Instagram Content Engine</span>
      </motion.div>

      <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
        Instagram content.<br />
        <motion.span
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400 bg-[size:200%_auto]"
        >
          Generated in seconds.
        </motion.span>
      </motion.h1>

      <motion.p variants={staggerItem} className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
        AI-powered reels, carousels, images, and captions for any business that wants to grow faster on Instagram. Pay per use — no monthly subscription, no wasted spend.
      </motion.p>

      <motion.div variants={staggerItem} className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
        <motion.a
          href="/apply"
          whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(45,212,191,0.35)' }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-teal-400 hover:bg-teal-300 text-black text-lg font-bold py-5 px-8 rounded-xl shadow-[0_0_40px_rgba(45,212,191,0.2)] transition-colors flex items-center justify-center gap-2 group"
        >
          Join the Waitlist <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.a>

        <motion.p
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-gray-600 text-sm"
        >
          Early access coming soon
        </motion.p>

        <div className="flex items-center gap-6 text-xs font-semibold text-gray-500">
          <motion.span whileHover={{ color: '#2dd4bf' }} className="flex items-center gap-1.5 cursor-default"><Sparkles className="w-4 h-4 text-teal-400" /> 6 CONTENT TYPES</motion.span>
          <motion.span whileHover={{ color: '#2dd4bf' }} className="flex items-center gap-1.5 cursor-default"><Zap className="w-4 h-4 text-teal-400" /> PAY PER USE</motion.span>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

// --- APP PREVIEW & MARQUEE ---
const AppPreviewMarquee = () => (
  <section className="pb-24 overflow-hidden">
    <div className="px-4 max-w-6xl mx-auto relative z-10 mb-[-60px]">
      <motion.div
        {...fadeInScale}
        className="bg-white/[0.02] rounded-2xl border border-white/[0.06] aspect-video relative overflow-hidden"
      >
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          {['bg-red-500/80', 'bg-amber-500/80', 'bg-emerald-500/80'].map((c, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring' }} className={`w-3 h-3 rounded-full ${c}`} />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-teal-400/3 pointer-events-none" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <PulsingPlayButton size="lg" />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-sm font-semibold tracking-[0.2em] text-gray-400 uppercase"
          >
            Watch Product Tour
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-6 right-6 bg-white/[0.04] backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 z-20 border border-white/[0.08]"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider text-gray-300">LIVE APP</span>
        </motion.div>
      </motion.div>
    </div>

    <div className="bg-white/[0.015] pt-32 pb-12 overflow-hidden flex flex-col gap-6 transform -skew-y-2 origin-left border-y border-white/[0.04]">
      <div className="flex whitespace-nowrap">
        <motion.div animate={{ x: [0, -1200] }} transition={{ repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" }} className="flex gap-12 text-gray-500 font-semibold tracking-widest text-sm pl-12 pr-12">
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2"><Film className="w-4 h-4" /> AI REELS</span>
              <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> CAROUSELS</span>
              <span className="flex items-center gap-2"><Image className="w-4 h-4" /> SINGLE IMAGES</span>
              <span className="flex items-center gap-2"><Type className="w-4 h-4" /> CAPTIONS</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
      <div className="flex whitespace-nowrap">
        <motion.div animate={{ x: [-1200, 0] }} transition={{ repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" }} className="flex gap-12 text-teal-400/60 font-semibold tracking-widest text-sm pl-12 pr-12">
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> CONTENT PLANS</span>
              <span className="flex items-center gap-2"><Megaphone className="w-4 h-4" /> AD CREATIVES</span>
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> BRAND STYLING</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

// --- VIDEO & TESTIMONIALS ---
const VideoAndTestimonials = () => (
  <section className="py-24 px-4 max-w-6xl mx-auto">
    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }}>
      <motion.div variants={staggerItem} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 text-sm font-semibold tracking-wider text-gray-500 uppercase">
        <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-teal-400 fill-current" /> Used by service businesses</span>
        <span className="hidden md:block w-1 h-1 rounded-full bg-gray-700" />
        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-teal-400" /> Content in seconds</span>
      </motion.div>

      <motion.h2 variants={staggerItem} className="text-4xl md:text-6xl font-bold tracking-tight text-center text-white mb-16 max-w-3xl mx-auto">
        See a month of content built in <span className="text-teal-400">30 seconds</span>
      </motion.h2>

      <motion.div
        variants={staggerItem}
        whileHover={{ borderColor: 'rgba(45,212,191,0.2)' }}
        className="w-full aspect-video rounded-2xl mb-24 relative overflow-hidden border border-white/[0.06] cursor-pointer transition-colors"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/8 via-transparent to-teal-400/4 pointer-events-none" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <PulsingPlayButton size="lg" />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-6 text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase"
          >
            Product Tour &middot; 2 min
          </motion.span>
        </div>
      </motion.div>
    </motion.div>

    <motion.div {...fadeInUp} className="text-center mb-16">
      <h3 className="text-2xl font-bold tracking-tight text-white">Real businesses. Real results.</h3>
    </motion.div>

    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
      {testimonials.map((t, i) => (
        <GlowCard
          key={i}
          className={`p-6 rounded-2xl ${i % 3 === 2
            ? 'bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20'
            : 'bg-white/[0.02] border border-white/[0.06]'
          } hover:border-teal-400/20`}
        >
          <motion.div variants={staggerItem}>
            <div className="flex items-center gap-3 mb-4">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-black font-bold text-sm">{t.avatar}</motion.div>
              <div>
                <p className="font-semibold text-white text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
          </motion.div>
        </GlowCard>
      ))}
    </motion.div>

    <motion.div {...fadeInUp}>
      <GlowCard className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-16">
          {[
            { val: "6", label: "Content Types" },
            { val: "10s", label: "Avg Generation" },
            { val: "\u00A30.31", label: "Per Token (Bundle)" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
              <h4 className="text-2xl font-bold text-white">{stat.val}</h4>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.a
          href="/apply"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(45,212,191,0.3)' }}
          whileTap={{ scale: 0.97 }}
          className="bg-teal-400 hover:bg-teal-300 text-black font-bold py-4 px-8 rounded-xl transition-colors whitespace-nowrap"
        >
          Join the Waitlist
        </motion.a>
      </GlowCard>
    </motion.div>
  </section>
);

// --- MANUAL VS ENGINE ---
const ManualVsEngine = () => (
  <section className="py-24 px-4 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="bg-white/[0.02] border border-red-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-0 right-0 w-64 h-64 bg-red-500 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <motion.div variants={staggerItem} className="flex justify-between items-start mb-12 relative z-10">
          <div>
            <span className="text-red-400 font-semibold tracking-widest text-xs uppercase block mb-3">&mdash; MANUAL CONTENT</span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The Problem</h3>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} className="text-right">
            <span className="text-gray-500 text-xs block mb-1 uppercase">Weekly Time</span>
            <span className="text-xl font-bold text-red-400">8+ HRS</span>
          </motion.div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {["Blank Page Anxiety", "Inconsistent Posting", "Hours on Canva", "Algorithm Guesswork", "Generic Captions", "Zero Strategy"].map((item, i) => (
            <motion.div
              variants={staggerItem}
              key={i}
              whileHover={{ x: 4, borderColor: 'rgba(239,68,68,0.2)' }}
              className="flex gap-3 bg-black/30 p-5 rounded-xl border border-white/[0.04] transition-colors"
            >
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span className="font-medium text-gray-300 text-sm">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-0 right-0 w-64 h-64 bg-teal-400 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <motion.div variants={staggerItem} className="flex justify-between items-start mb-12 relative z-10">
          <div>
            <span className="text-teal-400 font-semibold tracking-widest text-xs uppercase block mb-3">&mdash; AI-POWERED ENGINE</span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The Solution</h3>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} className="text-right">
            <span className="text-teal-400/60 text-xs block mb-1 uppercase">Weekly Time</span>
            <span className="text-xl font-bold text-teal-400">20 MIN</span>
          </motion.div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {["AI-Generated Reels", "Consistent Brand Style", "Seconds Not Hours", "Data-Driven Content", "Scroll-Stopping Hooks", "Full Month Planned"].map((item, i) => (
            <motion.div
              variants={staggerItem}
              key={i}
              whileHover={{ x: 4, borderColor: 'rgba(45,212,191,0.3)', boxShadow: '0 0 20px rgba(45,212,191,0.05)' }}
              className="flex gap-3 bg-black/20 p-5 rounded-xl border border-teal-400/10 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span className="font-medium text-white text-sm">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// --- 3D CARD ---
const Card3D = ({ item }: { item: { before: string; after: string } }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 20, stiffness: 300 });
  const springY = useSpring(y, { damping: 20, stiffness: 300 });
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  return (
    <motion.div
      variants={staggerItem}
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="h-64 cursor-default"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        whileHover={{ borderColor: 'rgba(45,212,191,0.25)', boxShadow: '0 0 40px rgba(45,212,191,0.08)' }}
        className="w-full h-full rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 flex flex-col justify-center items-center text-center [transform-style:preserve-3d] transition-all"
      >
        <motion.div whileHover={{ scale: 1.1 }}>
          <XCircle className="w-7 h-7 text-gray-600 mb-3" />
        </motion.div>
        <span className="text-sm font-medium text-gray-500 line-through mb-3">{item.before}</span>
        <motion.div animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="w-8 h-px bg-teal-400 mb-3" />
        <CheckCircle2 className="w-8 h-8 text-teal-400 mb-3" />
        <span className="text-lg font-bold text-white">{item.after}</span>
      </motion.div>
    </motion.div>
  );
};

// --- ROI, FEATURES & CONTENT MODULES ---
const ROIAndFeatures = () => (
  <section className="py-24 px-4 max-w-6xl mx-auto">
    <div className="mb-32">
      <motion.div {...fadeInUp} className="text-center mb-16">
        <motion.span animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="text-teal-400 font-semibold tracking-widest text-xs uppercase block mb-4 flex items-center justify-center gap-1.5"><Zap className="w-4 h-4" /> PROVEN IMPACT</motion.span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Numbers that speak for themselves.</h2>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: Clock, val: <><AnimatedNumber value={95} suffix="%" /></>, label: "Time Saved vs Manual" },
            { icon: Search, val: "10-20s", label: "Image Generation Time" },
            { icon: BarChart3, val: <><AnimatedNumber value={6} /></>, label: "Content Types, One Balance" },
            { icon: Sparkles, val: <>&pound;<AnimatedNumber value={2} />.50</>, label: "Per Piece of Content (From)" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <GlowCard key={i} className="bg-white/[0.02] p-8 rounded-2xl border border-white/[0.06] flex flex-col justify-center hover:border-teal-400/20">
                <motion.div variants={staggerItem}>
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
                    <Icon className="w-7 h-7 text-teal-400 mb-6" />
                  </motion.div>
                  <h4 className="text-4xl font-bold text-white mb-2">{stat.val}</h4>
                  <p className="text-gray-400 font-medium text-sm">{stat.label}</p>
                </motion.div>
              </GlowCard>
            );
          })}
        </div>

        <motion.div
          variants={staggerItem}
          whileHover={{ y: -8, scale: 1.02, boxShadow: '0 0 40px rgba(45,212,191,0.12)' }}
          className="bg-gradient-to-b from-teal-400/15 to-teal-400/5 border border-teal-400/20 rounded-2xl p-8 flex flex-col cursor-default"
        >
          <h4 className="text-2xl font-bold text-white mb-2">Cost Comparison</h4>
          <p className="text-teal-400/60 font-medium text-sm mb-10 pb-6 border-b border-white/10">Token-based &mdash; pay only for what you generate</p>
          <div className="space-y-6 flex-grow">
            {[
              { name: "Single Image", cost: "5 tokens" },
              { name: "Carousel Post", cost: "10 tokens" },
              { name: "AI Reel", cost: "15 tokens" },
              { name: "Content Plan", cost: "25 tokens" },
            ].map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-gray-400 font-medium text-sm">{row.name}</span>
                <span className="text-lg font-bold text-white">{row.cost}</span>
              </motion.div>
            ))}
          </div>
          <motion.a href="/pricing" whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(45,212,191,0.3)' }} whileTap={{ scale: 0.97 }} className="w-full bg-teal-400 text-black font-bold py-4 rounded-xl mt-8 hover:bg-teal-300 transition-colors text-center block">VIEW PRICING &rarr;</motion.a>
        </motion.div>
      </motion.div>
    </div>

    <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/[0.02] rounded-3xl p-8 lg:p-16 border border-white/[0.06] mb-32">
      <div>
        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
          You&apos;ve spent 3 hours.<br /><span className="text-teal-400">You&apos;ve posted nothing.</span>
        </h3>
        <div className="space-y-4 max-w-md">
          <motion.div initial={{ x: 0 }} whileInView={{ x: [0, -4, 0] }} transition={{ delay: 0.5 }} viewport={{ once: true }} className="bg-black/30 border border-red-500/20 p-6 rounded-xl flex items-center justify-between">
            <span className="text-gray-500 font-medium line-through text-sm">The Content Creation Marathon</span>
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          </motion.div>
          <motion.div initial={{ scale: 1 }} whileInView={{ scale: [1, 1.05, 1.05] }} transition={{ delay: 0.8, duration: 0.4 }} viewport={{ once: true }} className="bg-teal-400/10 border border-teal-400/20 p-6 rounded-xl flex items-center justify-between shadow-[0_0_30px_rgba(45,212,191,0.1)]">
            <span className="text-white font-bold text-sm">Describe &rarr; Generate &rarr; Post</span>
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          </motion.div>
        </div>
      </div>
      <div className="bg-black/30 p-8 md:p-12 rounded-2xl border border-white/[0.06] relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-32 h-32 bg-teal-400/5 rounded-bl-full z-0" />
        <div className="relative z-10">
          <h4 className="text-xl font-bold text-white mb-6 border-b border-white/[0.06] pb-4">Content shouldn&apos;t be a full-time job.</h4>
          <p className="text-lg text-gray-400 font-medium leading-relaxed">&ldquo;Enter your topic, pick a format, and let the AI do the creative work. Your content is ready in seconds &mdash; download and post directly. No editing needed.&rdquo;</p>
        </div>
      </div>
    </motion.div>

    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="mb-32">
      <motion.h2 variants={staggerItem} className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-16 text-center">See how businesses are ditching manual content...</motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { before: "Hours on Canva", after: "AI Images in 10 Seconds" },
          { before: "Staring at Blank Pages", after: "Full Month Planned Instantly" },
          { before: "Hiring a Freelancer", after: "Engine Does It Better" }
        ].map((item, i) => <Card3D key={i} item={item} />)}
      </div>
    </motion.div>

    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="mb-32">
      <motion.h2 variants={staggerItem} className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 text-center">
        Everything you need to stay consistent.
      </motion.h2>
      <motion.p variants={staggerItem} className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
        Six content types. One token balance. Generate what you need, when you need it.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contentTypes.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <GlowCard key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer group hover:border-teal-400/20">
              <motion.div variants={staggerItem} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <motion.span whileHover={{ rotate: 15, scale: 1.2 }} className="text-teal-400"><Icon className="w-6 h-6" /></motion.span>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-full"
                  >
                    {mod.tokens} tokens
                  </motion.span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{mod.name}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{mod.desc}</p>
              </motion.div>
            </GlowCard>
          );
        })}
      </div>
    </motion.div>
  </section>
);

// --- COMPARISON TABLE, PRICING, HOW IT WORKS, FAQ ---
const BottomSections = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      {/* Comparison Table */}
      <motion.div {...fadeInUp} className="mb-32 overflow-x-auto">
        <h3 className="text-3xl font-bold tracking-tight text-white mb-12 text-center">Why businesses choose the Content Engine</h3>
        <motion.table initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10">
              {['Provider', 'Speed', 'Quality', 'Brand Match', 'Scalability', 'Cost'].map(h => (
                <th key={h} className="py-4 px-6 text-gray-500 text-sm font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <motion.tr initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="border-b border-white/[0.06] bg-teal-400/5">
              <td className="py-4 px-6 font-bold text-teal-400 text-lg">Content Engine</td>
              {[0, 1, 2, 3].map(j => (
                <td key={j} className="py-4 px-6"><motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.2 + j * 0.1, type: 'spring' }} viewport={{ once: true }}><CheckCircle2 className="text-teal-400 w-5 h-5" /></motion.div></td>
              ))}
              <td className="py-4 px-6 font-mono font-bold text-white">From &pound;2.50</td>
            </motion.tr>
            {[
              { name: "Social Media Agency", cost: "\u00A32k+/mo" },
              { name: "Freelance Designer", cost: "\u00A3500+/mo" },
              { name: "DIY with Canva", cost: "Free (8+ hrs)" },
            ].map((prov, i) => (
              <motion.tr key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} viewport={{ once: true }} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-gray-300">{prov.name}</td>
                {[0, 1, 2, 3].map(j => (
                  <td key={j} className="py-4 px-6"><XCircle className="text-gray-600 w-5 h-5" /></td>
                ))}
                <td className="py-4 px-6 font-mono text-gray-500">{prov.cost}</td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </motion.div>

      {/* Token Pricing */}
      <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="mb-32">
        <motion.div variants={staggerItem} className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Token pricing</h3>
          <p className="text-gray-400 max-w-xl mx-auto">Pay only for what you generate. Tokens never expire and work across all apps.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <GlowCard className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:border-white/10">
            <motion.div variants={staggerItem}>
              <h4 className="text-lg font-semibold text-gray-400 mb-2">Pay As You Go</h4>
              <span className="text-4xl font-bold text-white block mb-1">&pound;0.50</span>
              <span className="text-gray-500 text-sm block mb-6">per token</span>
              <ul className="mb-8 space-y-3 text-gray-300 text-sm">
                {["All content types", "No minimum purchase", "Tokens never expire"].map((f, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> {f}</motion.li>
                ))}
              </ul>
              <motion.a href="/apply" whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.06)' }} whileTap={{ scale: 0.97 }} className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold transition-colors block text-center">Buy Tokens</motion.a>
            </motion.div>
          </GlowCard>

          <motion.div
            variants={staggerItem}
            whileHover={{ y: -8, scale: 1.02, boxShadow: '0 0 50px rgba(45,212,191,0.2)' }}
            className="bg-black border-2 border-teal-400 relative rounded-2xl p-10 shadow-[0_0_40px_rgba(45,212,191,0.15)] md:-translate-y-4 cursor-default"
          >
            <motion.div
              initial={{ scale: 0, y: 10 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-400 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest"
            >
              Best Value
            </motion.div>
            <h4 className="text-lg font-semibold text-teal-400/80 mb-2">Pro Bundle &mdash; 350 tokens</h4>
            <span className="text-5xl font-bold text-white block mb-1">&pound;110</span>
            <span className="text-teal-400 text-sm font-semibold block mb-6">&pound;0.31/token &mdash; Save 37%</span>
            <ul className="mb-8 space-y-3 text-gray-300 text-sm">
              {["350 tokens (35 carousels or 23 reels)", "Works across all apps", "Tokens never expire", "Best per-token rate"].map((f, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> {f}</motion.li>
              ))}
            </ul>
            <motion.a href="/apply" whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(45,212,191,0.3)' }} whileTap={{ scale: 0.97 }} className="w-full py-5 rounded-xl bg-teal-400 text-black font-bold hover:bg-teal-300 transition-colors text-lg block text-center">Get Pro Bundle</motion.a>
          </motion.div>

          <GlowCard className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:border-white/10">
            <motion.div variants={staggerItem}>
              <h4 className="text-lg font-semibold text-gray-400 mb-2">Business Plan</h4>
              <span className="text-4xl font-bold text-white block mb-1">Custom</span>
              <span className="text-gray-500 text-sm block mb-6">per month</span>
              <ul className="mb-8 space-y-3 text-gray-300 text-sm">
                {["Custom token allocation", "Better rate at volume", "Strategy session with JP"].map((f, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> {f}</motion.li>
                ))}
              </ul>
              <motion.a href="/apply" whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.06)' }} whileTap={{ scale: 0.97 }} className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold transition-colors block text-center">Book a Call</motion.a>
            </motion.div>
          </GlowCard>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="mb-32">
        <motion.h4 variants={staggerItem} className="text-center font-bold text-gray-500 uppercase tracking-widest text-sm mb-12">How it works</motion.h4>
        <div className="flex flex-col md:flex-row justify-between relative max-w-4xl mx-auto">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease }}
            viewport={{ once: true }}
            className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-teal-400/30 via-teal-400/10 to-teal-400/30 z-0 origin-left"
          />
          {[
            { step: "01", label: "Pick your content type", desc: "Reels, carousels, images, captions, content plans, or ad creatives." },
            { step: "02", label: "Describe what you want", desc: "Enter a topic, brand style, or simple prompt. The AI does the rest." },
            { step: "03", label: "Download and post", desc: "Ready in seconds. Download and post directly — no editing needed." },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="flex flex-col items-center relative z-10 mb-8 md:mb-0 px-4 text-center flex-1"
            >
              <motion.div
                whileHover={{ scale: 1.15, boxShadow: '0 0 25px rgba(45,212,191,0.2)' }}
                className="w-12 h-12 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 font-bold text-sm flex items-center justify-center mb-5 transition-all"
              >
                {item.step}
              </motion.div>
              <span className="font-bold text-white text-sm mb-2">{item.label}</span>
              <span className="text-gray-500 text-xs leading-relaxed">{item.desc}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-32"
      >
        <motion.div
          whileHover={{ borderColor: 'rgba(45,212,191,0.35)' }}
          className="bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-10 md:p-14 text-center relative overflow-hidden transition-colors"
        >
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to stop stressing about content?</h2>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto">We&apos;re opening early access soon. Join the waitlist and be first in line.</p>
            <motion.a
              href="/apply"
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(45,212,191,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-block bg-teal-400 hover:bg-teal-300 text-black font-bold py-4 px-10 rounded-xl transition-colors shadow-[0_0_40px_rgba(45,212,191,0.2)]"
            >
              Join the Waitlist <ArrowRight className="w-5 h-5 inline ml-2" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      {/* FAQ */}
      <motion.div {...fadeInUp} className="max-w-2xl mx-auto mb-32">
        <h3 className="text-center text-3xl font-bold tracking-tight text-white mb-12">Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ borderColor: 'rgba(45,212,191,0.2)' }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden transition-colors cursor-pointer"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="p-6 flex justify-between items-center font-medium text-white text-sm">
                {faq.q}
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {openFaq === i ? <Minus className="w-4 h-4 text-teal-400 shrink-0 ml-4" /> : <Plus className="w-4 h-4 text-gray-500 shrink-0 ml-4" />}
                </motion.div>
              </div>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="px-6 pb-0 text-gray-400 text-sm leading-relaxed overflow-hidden"
                  >
                    <div className="pb-6">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// --- MAIN EXPORT ---
export default function InstaEngineClient() {
  const [phase, setPhase] = useState<'intro' | 'prehero' | 'app'>('intro');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-400 selection:text-black overflow-x-hidden relative pb-24 font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/[0.04] blur-[120px] rounded-full" />
      </div>

      {phase === 'app' && <FloatingParticles />}

      {phase === 'intro' && <IntroTransition onComplete={() => setPhase('prehero')} />}
      {phase === 'prehero' && <PreHero onComplete={() => setPhase('app')} />}

      <div className={`relative z-10 transition-opacity duration-1000 ${phase === 'app' ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <Navbar startAnim={phase === 'app'} />
        <HeroSection startAnim={phase === 'app'} />
        <AppPreviewMarquee />
        <VideoAndTestimonials />
        <ManualVsEngine />
        <ROIAndFeatures />
        <BottomSections />

        <footer className="border-t border-white/[0.06] py-10 px-6 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.a href="/" whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-teal-400 flex items-center justify-center">
                <Camera className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-white text-sm">Insta<span className="text-teal-400">Engine</span></span>
            </motion.a>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {[
                { label: 'SEO Blog Writer', href: '/apps/seo-blog' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Blog', href: '/blog' },
                { label: 'Book a Call', href: '/apply' },
              ].map(link => (
                <motion.a key={link.label} href={link.href} whileHover={{ color: '#9ca3af' }} className="cursor-pointer transition-colors">{link.label}</motion.a>
              ))}
            </div>
            <p className="text-gray-600 text-sm">&copy; 2026 JP Automations</p>
          </div>
        </footer>
      </div>

      {/* Sticky bottom bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: phase === 'app' ? 0 : 100, opacity: phase === 'app' ? 1 : 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 80, damping: 15 }}
        className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto bg-white/[0.03] backdrop-blur-xl text-white rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row items-center gap-6 justify-between border border-white/[0.06] z-50"
      >
        <span className="font-semibold whitespace-nowrap hidden md:block text-sm">Instagram content, on demand</span>
        <span className="hidden md:block w-px h-6 bg-white/10" />
        <motion.span animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="font-semibold text-teal-400 text-sm tracking-wider flex items-center gap-2"><Sparkles className="w-4 h-4" /> EARLY ACCESS OPENING</motion.span>
        <motion.a
          href="/apply"
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(45,212,191,0.3)' }}
          whileTap={{ scale: 0.97 }}
          className="w-full md:w-auto bg-teal-400 hover:bg-teal-300 text-black font-bold py-2 px-6 rounded-lg transition-colors whitespace-nowrap text-center"
        >
          Join Waitlist
        </motion.a>
      </motion.div>
    </div>
  );
}
