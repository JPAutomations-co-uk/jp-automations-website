"use client"

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import {
    Play, CheckCircle2, XCircle, Clock, Zap,  Shield,
    TrendingUp, Activity, TerminalSquare, Calendar, Sliders,
    MousePointer2, AlertTriangle, Plus, Minus
} from 'lucide-react';

// --- TOKENS & EASING ---
const easeCinematic = [0.77, 0, 0.175, 1];

// --- DATA ARRAYS ---
const marqueeItems = ["6 INTEGRATED HUBS", "FINANCIAL TRACKING", "CLIENT PORTAL", "MOBILE OPTIMIZED"];

const testimonials = [
    { name: "Sarah K.", role: "Growth Coach", text: "I reclaimed 12 hours my first week. Insane.", avatar: "SK" },
    { name: "Marcus T.", role: "Agency Owner", text: "The ROI was instantaneous. Scaled from 3 to 10 clients.", avatar: "MT" },
    { name: "Elena R.", role: "Creator", text: "Blank page anxiety is literally gone.", avatar: "ER" },
    { name: "David L.", role: "Consultant", text: "My engagement doubled just by using the prompt library.", avatar: "DL" },
    { name: "Priya M.", role: "Designer", text: "The centralized hub is a masterpiece of UX.", avatar: "PM" },
    { name: "James H.", role: "Founder", text: "Automation that actually feels human.", avatar: "JH" }
];

const chaosCards = [
    "Blank Page Anxiety", "Algorithm Guesswork", "Scattered Assets",
    "Inconsistent Hooks", "Manual Posting", "Burnout Cycles"
];

const engineCards = [
    "AI Prompt Library", "Viral Hook Generator", "Centralized Hub",
    "Proven Frameworks", "Automated Flows", "Reclaimed Time"
];

const marketData = [
    { provider: "InstaEngine", speed: "Instant", conv: "High", qual: "Expert", scale: "Infinite", cost: "$97", type: "engine" },
    { provider: "In-house Team", speed: "Slow", conv: "Varies", qual: "High", scale: "Linear", cost: "$4k+/mo", type: "other" },
    { provider: "Agencies", speed: "Medium", conv: "High", qual: "High", scale: "Linear", cost: "$2k+/mo", type: "other" },
    { provider: "Freelancers", speed: "Varies", conv: "Varies", qual: "Varies", scale: "Struggles", cost: "$1k+/mo", type: "other" },
    { provider: "Basic AI Tools", speed: "Fast", conv: "Low", qual: "Robotic", scale: "Broken", cost: "$20/mo", type: "other" }
];

const faqs = [
    { q: "What is InstaEngine?", a: "A comprehensive operating system built on Notion/Airtable designed to automate your entire content pipeline." },
    { q: "Do I need coding experience?", a: "Zero. If you can drag and drop, you can run the Engine." },
    { q: "How long does setup take?", a: "Under 15 minutes. You'll be generating ready-to-post content on day one." },
    { q: "Is this a subscription?", a: "No. It is a one-time investment for lifetime access to the core engine." },
    { q: "Does it work for my niche?", a: "Yes. The frameworks are industry-agnostic and adapt to your unique voice." }
];

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-5xl font-sans font-bold text-white mb-4 tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-400 font-mono text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
);

// --- 1. PRELOADER HERO & WIPE TRANSITION ---
const PreloaderHero = ({ onComplete }: { onComplete: () => void }) => {
    const [phase, setPhase] = useState<'hero' | 'loading' | 'expanding' | 'done'>('hero');
    const [textMorphed, setTextMorphed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setTextMorphed(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        setPhase('loading');
        if (typeof window !== 'undefined') document.body.style.overflow = 'hidden';

        setTimeout(() => {
            setPhase('expanding');
            setTimeout(() => {
                setPhase('done');
                if (typeof window !== 'undefined') document.body.style.overflow = 'auto';
                onComplete();
            }, 1000);
        }, 1500);
    };

    if (phase === 'done') return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4 overflow-hidden"
            animate={phase === 'expanding' ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            {phase === 'hero' && (
                <div className="text-center max-w-4xl w-full flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        {!textMorphed ? (
                            <motion.h1
                                key="text1"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                className="text-4xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white mb-10"
                            >
                                You can&apos;t scale what you don&apos;t automate.
                            </motion.h1>
                        ) : (
                            <motion.h1
                                key="text2"
                                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tight bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent mb-10"
                            >
                                InstaEngine V1.0
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.2, duration: 0.4 }}
                        onClick={handleStart}
                        className="group relative inline-flex items-center justify-center px-8 py-5 font-bold text-white bg-violet-600 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]"
                    >
                        <span className="relative z-10 text-lg">Start the Engine — $97</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-500 group-hover:scale-110 transition-transform" />
                    </motion.button>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6 }} className="mt-6 font-mono text-xs md:text-sm text-slate-500 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-500" />
                        Offer Expiring: <span className="text-slate-300">71:58:45</span>
                    </motion.div>
                </div>
            )}

            {(phase === 'loading' || phase === 'expanding') && (
                <div className="w-full max-w-md flex flex-col items-center relative z-20">
                    <motion.div animate={phase === 'expanding' ? { opacity: 0 } : { opacity: 1 }} className="text-white/70 font-mono mb-6 text-xs md:text-sm animate-pulse tracking-widest uppercase">
                        Uploading to Engine...
                    </motion.div>
                    <motion.div
                        className="w-full h-1 relative z-30 flex items-center justify-center origin-center"
                        animate={phase === 'expanding' ? { scaleY: 200, scaleX: 10, filter: 'blur(10px)' } : {}}
                        transition={{ duration: 1.2, ease: easeCinematic }}
                    >
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: "linear" }}
                                className="h-full bg-violet-500"
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

// --- 2. APP PREVIEW & SOCIAL PROOF STRIP ---
const AppPreview = () => (
    <section className="pt-32 pb-16 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="rounded-xl border border-white/10 backdrop-blur-xl bg-slate-900/60 p-2 md:p-3 shadow-[0_0_80px_-20px_rgba(139,92,246,0.15)] relative overflow-hidden group">
            <div className="absolute top-5 left-5 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="aspect-[16/10] md:aspect-[21/9] bg-slate-950/80 rounded-lg relative overflow-hidden border border-white/5 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/5 blur-3xl opacity-50" />
                <div className="absolute inset-0 grid grid-cols-12 gap-4 p-8 md:p-12 opacity-20 pointer-events-none">
                    <div className="col-span-3 bg-white/5 rounded-lg border border-white/10" />
                    <div className="col-span-9 grid grid-rows-3 gap-4">
                        <div className="row-span-2 bg-white/5 rounded-lg border border-white/10" />
                        <div className="row-span-1 grid grid-cols-3 gap-4">
                            <div className="col-span-2 bg-white/5 rounded-lg border border-white/10" />
                            <div className="col-span-1 bg-white/5 rounded-lg border border-white/10" />
                        </div>
                    </div>
                </div>
                <button className="z-20 w-20 h-20 md:w-24 md:h-24 rounded-full bg-violet-600 flex items-center justify-center backdrop-blur-md border border-white/20 text-white shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:scale-110 transition-transform duration-500 ease-out">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                </button>
            </div>
        </div>

        <div className="mt-16 overflow-hidden border-y border-white/5 py-6 flex relative select-none bg-slate-950/50">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                className="flex whitespace-nowrap gap-16 text-slate-500 font-mono text-sm tracking-widest font-semibold"
            >
                {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                    <span key={i} className="flex items-center gap-16">
                        {item} <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    </span>
                ))}
            </motion.div>
        </div>
    </section>
);

// --- 3. VIDEO TOUR & TESTIMONIAL WALL ---
const VideoAndTestimonials = () => (
    <section className="py-24 px-4 max-w-7xl mx-auto">
        <SectionHeader title="See Your Content Scale in 3 Seconds (Not 3 Hours)" />

        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-amber-500 to-violet-600 rounded-2xl p-1 shadow-2xl mb-24 cursor-pointer hover:scale-[1.02] transition-transform duration-500">
            <div className="bg-slate-950 rounded-xl aspect-video flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-900/40 mix-blend-overlay" />
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors z-10">
                    <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="mt-4 font-mono text-slate-300 z-10">InstaEngine Product Tour</p>
            </div>
        </div>

        <div className="text-center mb-12">
            <h3 className="text-2xl font-sans text-white">Real stories from real creators...</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
                <div key={i} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-violet-500/50 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                            {t.avatar}
                        </div>
                        <div>
                            <p className="text-white font-medium">{t.name}</p>
                            <p className="text-slate-400 text-sm font-mono">{t.role}</p>
                        </div>
                    </div>
                    <p className="text-slate-300 italic">&ldquo;{t.text}&rdquo;</p>
                </div>
            ))}
        </div>
    </section>
);

// --- 4. CHAOS VS. ENGINE STATE ---
const ChaosVsEngine = () => (
    <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chaos */}
            <div className="bg-slate-900/30 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <span className="text-red-400 font-mono text-sm font-bold tracking-wider uppercase mb-2 block">The Problem</span>
                        <h3 className="text-3xl text-white font-sans font-bold">Chaos Mode</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-400 block text-sm">Avg Annual Loss</span>
                        <span className="text-red-400 font-bold text-xl">$46,800</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    {chaosCards.map((c, i) => (
                        <div key={i} className="flex flex-col gap-2 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                            <XCircle className="w-6 h-6 text-red-500" />
                            <span className="text-slate-300 text-sm md:text-base">{c}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Engine */}
            <div className="bg-slate-900/30 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <span className="text-emerald-400 font-mono text-sm font-bold tracking-wider uppercase mb-2 block">The Solution</span>
                        <h3 className="text-3xl text-white font-sans font-bold">Engine Mode</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-400 block text-sm">Weekly Saved</span>
                        <span className="text-emerald-400 font-bold text-xl">15 Hrs</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    {engineCards.map((c, i) => (
                        <div key={i} className="flex flex-col gap-2 bg-slate-950/50 p-4 rounded-xl border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            <span className="text-slate-200 font-medium text-sm md:text-base">{c}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

// --- 5. ROI METRICS BOARD ---
const ROIMetrics = () => (
    <section className="py-24 px-4 max-w-7xl mx-auto">
        <SectionHeader title="The ROI of Automation" subtitle="Stop burning cash on inefficient processes." />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                    { icon: <TrendingUp className="text-violet-400" />, val: "80%", label: "Reduction in Friction" },
                    { icon: <Clock className="text-emerald-400" />, val: "10-12", label: "Weekly Hrs Saved" },
                    { icon: <Zap className="text-amber-400" />, val: "24%", label: "Faster Retrieval" },
                    { icon: <Activity className="text-blue-400" />, val: "3x", label: "Delivery Capacity" }
                ].map((m, i) => (
                    <div key={i} className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                        <div className="p-3 bg-white/5 w-fit rounded-lg mb-6">{m.icon}</div>
                        <div>
                            <h4 className="text-4xl font-bold text-white mb-2">{m.val}</h4>
                            <p className="text-slate-400 font-mono text-sm">{m.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:col-span-1 bg-gradient-to-b from-violet-900/40 to-slate-900 border border-violet-500/30 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                    <h4 className="text-2xl font-bold text-white mb-2">Compound Savings</h4>
                    <p className="text-violet-300 font-mono text-sm mb-8">One-time investment $97</p>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-white/10 pb-2">
                            <span className="text-slate-400">1-Year Savings</span>
                            <span className="text-xl text-emerald-400 font-bold">$12,400</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/10 pb-2">
                            <span className="text-slate-400">3-Year Savings</span>
                            <span className="text-xl text-emerald-400 font-bold">$37,200</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/10 pb-2">
                            <span className="text-slate-400">5-Year Savings</span>
                            <span className="text-2xl text-emerald-400 font-bold">$62,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- 6. MICRO-DECISIONS & TRANSFORMATIONS ---
const MicroDecisions = () => (
    <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 lg:p-12 mb-16">
            <SectionHeader title="You've Made 44 Decisions. It's 10:15 AM." subtitle="Decision fatigue is killing your creative capacity." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
                <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-center justify-between line-through text-red-200 opacity-60">
                        <span>The Content Marathon</span>
                        <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl flex items-center justify-between text-emerald-50 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <span className="font-bold">Pre-Decided Architecture</span>
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
                <div className="bg-slate-950 border border-white/5 p-8 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-violet-400" />
                        <h4 className="text-xl text-white font-bold">Pro Tip: The Brain Filing Cabinet</h4>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                        InstaEngine acts as an external brain. Instead of asking &ldquo;What should I post today?&rdquo;, you execute a pre-determined framework. You don&apos;t think. You just load the prompt, tweak the hook, and publish.
                    </p>
                </div>
            </div>
        </div>

        {/* Transformations UI */}
        <div className="mt-24">
            <h3 className="text-3xl text-center text-white font-bold mb-12">See how creators are ditching chaos.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { before: "Laptop Closes, Brain Doesn't", after: "Work Done, Mind Clear" },
                    { before: "Staring at Blank Pages", after: "Filling in Proven Frameworks" },
                    { before: "Posting for Likes", after: "Building a Predictable Pipeline" }
                ].map((t, i) => (
                    <div key={i} className="group relative [perspective:1000px] h-64">
                        <div className="absolute inset-0 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                            {/* Front */}
                            <div className="absolute inset-0 bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center [backface-visibility:hidden]">
                                <XCircle className="w-8 h-8 text-slate-500 mb-4" />
                                <span className="text-slate-400 font-medium">{t.before}</span>
                            </div>
                            {/* Back */}
                            <div className="absolute inset-0 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
                                <span className="text-emerald-100 font-bold">{t.after}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- 7. INTERACTIVE FEATURE HUB ---
const InteractiveBento = () => {
    const cursor = useAnimation();
    const [activeFeature, setActiveFeature] = useState(0);
    const [hookText, setHookText] = useState("");
    const [aspect, setAspect] = useState("1/1");
    const [count, setCount] = useState(0);
    const targetHook = "Wait, you're still creating manually?";

    useEffect(() => {
        let isActive = true;
        const runSequence = async () => {
            while (isActive) {
                // Pos 1
                await cursor.start({ left: '15%', top: '25%', transition: { duration: 1.2, ease: "easeInOut" } });
                await cursor.start({ scale: 0.8, transition: { duration: 0.1 } }); await cursor.start({ scale: 1, transition: { duration: 0.1 } });
                setActiveFeature(1);
                setHookText("");
                for (let i = 0; i <= targetHook.length; i++) {
                    if (!isActive) break; setHookText(targetHook.slice(0, i)); await new Promise(r => setTimeout(r, 40));
                }
                await new Promise(r => setTimeout(r, 800));

                // Pos 2
                await cursor.start({ left: '80%', top: '25%', transition: { duration: 1, ease: "easeInOut" } });
                setActiveFeature(2);
                await new Promise(r => setTimeout(r, 1200));

                // Pos 3
                await cursor.start({ left: '40%', top: '55%', transition: { duration: 0.8, ease: "easeInOut" } });
                await cursor.start({ scale: 0.8, transition: { duration: 0.1 } }); await cursor.start({ scale: 1, transition: { duration: 0.1 } });
                setActiveFeature(3);
                setAspect('16/9');
                await cursor.start({ left: '60%', top: '55%', transition: { duration: 0.6, ease: "easeOut" } });
                setAspect('4/5');
                await new Promise(r => setTimeout(r, 1200));

                // Pos 4
                await cursor.start({ left: '20%', top: '80%', transition: { duration: 0.8, ease: "easeInOut" } });
                await cursor.start({ scale: 0.8, transition: { duration: 0.1 } }); await cursor.start({ scale: 1, transition: { duration: 0.1 } });
                setActiveFeature(4);
                for (let i = 0; i <= 20; i++) {
                    if (!isActive) break; setCount(Math.floor((124500 / 20) * i)); await new Promise(r => setTimeout(r, 40));
                }
                await new Promise(r => setTimeout(r, 1200));

                // Pos 5
                await cursor.start({ left: '80%', top: '80%', transition: { duration: 1, ease: "easeInOut" } });
                setActiveFeature(5);
                await new Promise(r => setTimeout(r, 2000));

                setActiveFeature(0); setAspect('1/1'); setCount(0); setHookText('');
            }
        };
        runSequence();
        return () => { isActive = false; };
    }, [cursor]);

    return (
        <section className="py-24 px-4 max-w-7xl mx-auto relative cursor-default select-none">
            <SectionHeader title="The Engine Room" subtitle="Watch the OS handle the heavy lifting autonomously." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px] relative mt-16 group">

                {/* Card 1: Script */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col relative transition-colors hover:border-violet-500/30">
                    <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                        <TerminalSquare className="w-5 h-5 text-violet-400" />
                        <span className="font-mono text-sm text-slate-300">Script.tsx</span>
                    </div>
                    <div className={`font-mono text-emerald-400 transition-opacity ${activeFeature === 1 ? 'opacity-100' : 'opacity-50'}`}>
                        <span className="text-violet-400">const</span> hook = <span className="text-amber-300">&quot;{hookText}</span><motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity }} className="w-2 h-4 bg-emerald-400 inline-block align-middle ml-1" />&quot;
                    </div>
                </div>

                {/* Card 2: Calendar */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative transition-colors hover:border-emerald-500/30">
                    <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-sm text-slate-400">Content Calendar</span>
                        <Calendar className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={`aspect-square rounded border transition-all duration-300 ${activeFeature === 2 && i === 6 ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-950 border-white/5'}`} />
                        ))}
                    </div>
                </div>

                {/* Card 3: Dynamic Aspect */}
                <div className="md:row-span-2 bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center relative transition-colors hover:border-blue-500/30">
                    <Sliders className="w-5 h-5 text-slate-500 absolute top-6 right-6" />
                    <motion.div
                        className="bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center transition-all duration-500 ease-out h-32"
                        style={{ aspectRatio: aspect }}
                    >
                        <span className="font-mono text-xs text-slate-500">{aspect}</span>
                    </motion.div>
                    <div className="w-full h-1 bg-white/5 mt-8 rounded-full relative">
                        <div className={`h-full bg-blue-500 rounded-full transition-all duration-500 ${activeFeature === 3 ? 'w-3/4' : 'w-1/4'}`} />
                    </div>
                </div>

                {/* Card 4: Metrics */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative transition-colors hover:border-amber-500/30 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-slate-500">Last 30 Days</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-4xl font-bold text-white tracking-tight">{count.toLocaleString()}</span>
                </div>

                {/* Card 5: Tooltip */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative transition-colors hover:border-pink-500/30 flex items-center justify-center">
                    <div className="w-full h-24 bg-slate-950 rounded border border-white/5 relative">
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold py-1 px-3 rounded shadow-lg transition-all duration-300 ${activeFeature === 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                            Viral Probability: 98%
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-violet-600" />
                        </div>
                    </div>
                </div>

                {/* Fake Cursor */}
                <motion.div
                    animate={cursor}
                    initial={{ left: '50%', top: '50%' }}
                    className="absolute z-50 pointer-events-none drop-shadow-2xl hidden md:block"
                >
                    <MousePointer2 className="w-8 h-8 text-white fill-slate-900 -rotate-12" />
                </motion.div>
            </div>
        </section>
    );
};

// --- 8. MARKET COMPARISON TABLE ---
const ComparisonTable = () => (
    <section className="py-24 px-4 max-w-7xl mx-auto overflow-x-auto">
        <SectionHeader title="The ROI Calculation" />
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
                <tr className="border-b border-white/10">
                    <th className="py-4 px-6 text-slate-400 font-mono">Provider</th>
                    <th className="py-4 px-6 text-slate-400 font-mono">Speed</th>
                    <th className="py-4 px-6 text-slate-400 font-mono">Conversion</th>
                    <th className="py-4 px-6 text-slate-400 font-mono">Quality</th>
                    <th className="py-4 px-6 text-slate-400 font-mono">Scalability</th>
                    <th className="py-4 px-6 text-slate-400 font-mono">Cost</th>
                </tr>
            </thead>
            <tbody>
                {marketData.map((row, i) => (
                    <tr key={i} className={`border-b border-white/5 ${row.type === 'engine' ? 'bg-violet-900/20' : 'hover:bg-slate-900/50'}`}>
                        <td className="py-4 px-6">
                            <span className={`font-bold ${row.type === 'engine' ? 'text-violet-400 text-lg' : 'text-slate-300'}`}>{row.provider}</span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                                {row.speed === 'Instant' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                <span className={row.type === 'engine' ? 'text-white' : 'text-slate-400'}>{row.speed}</span>
                            </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{row.conv}</td>
                        <td className="py-4 px-6 text-slate-300">{row.qual}</td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                                {row.scale === 'Infinite' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                                <span className={row.type === 'engine' ? 'text-white' : 'text-slate-400'}>{row.scale}</span>
                            </div>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-200">{row.cost}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </section>
);

// --- 9. THE TALE OF TWO CREATORS ---
const TaleOfTwoCreators = () => (
    <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* The Drowning Creator */}
            <div className="bg-slate-900/30 border border-red-500/30 rounded-3xl p-8 lg:p-12 relative overflow-hidden group shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full" />
                <h3 className="text-2xl font-bold text-red-400 mb-8 border-b border-red-500/20 pb-4">The Drowning Creator</h3>
                <div className="space-y-4 font-mono text-slate-300 text-sm">
                    <div className="flex justify-between p-3 bg-slate-950 rounded border border-white/5"><span className="text-slate-500">Revenue</span><span className="font-bold text-white">$85k / yr</span></div>
                    <div className="flex justify-between p-3 bg-red-950/30 rounded border border-red-500/20"><span className="text-slate-500">Hours/week</span><span className="font-bold text-red-400">65 hrs</span></div>
                    <div className="flex justify-between p-3 bg-slate-950 rounded border border-white/5"><span className="text-slate-500">Tools setup</span><span className="font-bold text-white">8 different apps</span></div>
                    <div className="flex justify-between p-3 bg-slate-950 rounded border border-white/5"><span className="text-slate-500">Output</span><span className="font-bold text-white">Inconsistent</span></div>
                </div>
            </div>

            {/* The Engine Pro */}
            <div className="bg-slate-900/30 border border-emerald-500/40 rounded-3xl p-8 lg:p-12 relative overflow-hidden group shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full" />
                <h3 className="text-2xl font-bold text-emerald-400 mb-8 border-b border-emerald-500/20 pb-4">The Engine Pro</h3>
                <div className="space-y-4 font-mono text-slate-300 text-sm">
                    <div className="flex justify-between p-3 bg-emerald-950/20 rounded border border-emerald-500/20"><span className="text-slate-400">Revenue</span><span className="font-bold text-emerald-400">$118k / yr</span></div>
                    <div className="flex justify-between p-3 bg-emerald-950/20 rounded border border-emerald-500/20"><span className="text-slate-400">Hours/week</span><span className="font-bold text-emerald-400">45 hrs</span></div>
                    <div className="flex justify-between p-3 bg-emerald-950/20 rounded border border-emerald-500/20"><span className="text-slate-400">Tools setup</span><span className="font-bold text-emerald-400">1 OS</span></div>
                    <div className="flex justify-between p-3 bg-emerald-950/20 rounded border border-emerald-500/20"><span className="text-slate-400">Output</span><span className="font-bold text-emerald-400">Predictable</span></div>
                </div>
            </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center text-emerald-400 font-bold text-xl md:text-2xl shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            +$33,000 / year Advantage (with 20+ hours saved weekly)
        </div>
    </section>
);

// --- 10. PRICING, TIMELINE & FAQ ---
const FinalSections = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <section className="py-24 px-4 max-w-7xl mx-auto">
            {/* Pricing */}
            <div className="mb-32">
                <SectionHeader title="Claim Your Engine Pipeline" subtitle="Lifetime access. No subscriptions. Immediate ROI." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Tier 1 */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
                        <h4 className="text-lg text-slate-400 mb-2">Solo Creator</h4>
                        <span className="text-4xl font-bold text-white block mb-6">$97</span>
                        <ul className="mb-8 space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Core OS</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 50+ Hook Lib</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tracker Hub</li>
                        </ul>
                        <button className="w-full py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">Select Solo</button>
                    </div>

                    {/* Tier 2 (Highlighted) */}
                    <div className="bg-slate-900 border-2 border-violet-500 relative rounded-2xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.2)] md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                        <h4 className="text-lg text-violet-300 mb-2">Power Engine</h4>
                        <span className="text-5xl font-bold text-white block mb-6">$247</span>
                        <ul className="mb-8 space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Everything in Solo</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> AI Auto-Prompting integrations</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Advanced Financial Hub</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Video Editing Assets Library</li>
                        </ul>
                        <button className="w-full py-4 rounded-lg bg-violet-600 text-white font-bold hover:bg-violet-500 transition-colors">Start Power Engine</button>
                    </div>

                    {/* Tier 3 */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
                        <h4 className="text-lg text-slate-400 mb-2">Agency License</h4>
                        <span className="text-4xl font-bold text-white block mb-6">$497</span>
                        <ul className="mb-8 space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Everything in Power</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-Client Portals</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Team Hand-off Checklists</li>
                        </ul>
                        <button className="w-full py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">Get Agency Access</button>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="mb-32">
                <h3 className="text-center text-3xl font-bold text-white mb-16">The 15-Minute Activation Flow</h3>
                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {["Instant Email", "Connect IG", "Generate", "Recover Time"].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-slate-900 border-2 border-violet-500 rounded-full flex items-center justify-center text-violet-400 font-bold mb-4 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                    {i + 1}
                                </div>
                                <span className="text-white font-medium">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto">
                <h3 className="text-center text-3xl font-bold text-white mb-12">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                            <div className="p-6 flex justify-between items-center text-white font-medium">
                                {faq.q}
                                {openFaq === i ? <Minus className="w-5 h-5 text-slate-400" /> : <Plus className="w-5 h-5 text-slate-400" />}
                            </div>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-slate-400 font-sans leading-relaxed">
                                        {faq.a}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- MAIN EXPORT ---
export default function InstaEngineClient() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="bg-slate-950 min-h-screen text-slate-50 font-sans selection:bg-violet-500/30 overflow-x-hidden">
            <PreloaderHero onComplete={() => setIsLoaded(true)} />

            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100 relative' : 'opacity-0 fixed inset-0 pointer-events-none'}`}>
                <AppPreview />
                <VideoAndTestimonials />
                <ChaosVsEngine />
                <ROIMetrics />
                <MicroDecisions />
                <InteractiveBento />
                <ComparisonTable />
                <TaleOfTwoCreators />
                <FinalSections />

                <footer className="border-t border-white/10 py-12 text-center text-slate-600 font-mono text-sm mt-12 bg-slate-950/80 backdrop-blur-md">
                    <p>InstaEngine by JP Automations &copy; 2026. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
