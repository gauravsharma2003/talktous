import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X, Compass } from 'lucide-react';
import gsap from 'gsap';

function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}

function ImageWithFallback({
    src,
    alt = '',
    className,
    fallbackClassName,
    loading = 'lazy',
    decoding = 'async',
}) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                aria-label={alt || 'image placeholder'}
                role="img"
                className={cx(
                    'bg-gray-200 text-gray-400',
                    'flex items-center justify-center',
                    'select-none',
                    className,
                    fallbackClassName,
                )}
            >
                <span className="text-xs">Image</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading={loading}
            decoding={decoding}
            className={className}
            onError={() => setFailed(true)}
        />
    );
}

const ARTICLES = [
    { id: 1, category: 'World', title: "'In mutually convenient manner': Can Russia-India-China troika be revived? MEA responds to Russia's push", hasImage: true },
    { id: 2, category: 'Tech', title: 'Google DeepMind unveils Gemini 3.0 with real-time video understanding capabilities', hasGrid: true },
    { id: 3, category: 'India', title: 'Budget 2026: FM Sitharaman announces major tax relief for middle class, new slabs effective April', hasImage: true },
    { id: 4, category: 'Sports', title: 'IPL 2026 mega auction: CSK retains Dhoni as mentor, picks 3 uncapped Indian stars', hasGrid: true },
    { id: 5, category: 'Business', title: 'Sensex crosses 95,000 for the first time as FII inflows surge to record highs', hasImage: true },
    { id: 6, category: 'World', title: 'EU passes landmark AI regulation bill requiring transparency for all foundation models', hasGrid: true },
    { id: 7, category: 'Science', title: 'ISRO Gaganyaan crew completes orbital mission, lands safely in Bay of Bengal', hasImage: true },
    { id: 8, category: 'Entertainment', title: "Shah Rukh Khan's 'King' breaks all opening day records, earns ₹125 crore worldwide", hasGrid: true },
    { id: 9, category: 'India', title: 'Delhi-Mumbai expressway fully operational: Travel time cut to 12 hours, toll rates announced', hasImage: true },
    { id: 10, category: 'Tech', title: 'Apple Intelligence expands to India with Hindi, Tamil, and 8 more regional language support', hasGrid: true },
];

const GRID_IMAGES = [
    ['https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200&h=150&fit=crop'],
    ['https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&h=150&fit=crop'],
    ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop'],
    ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=150&fit=crop'],
    ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1461896836934-bd45ba3b23c0?w=200&h=150&fit=crop'],
];

const QUICK_ACCESS_ITEMS = [
    { label: 'World News', icon: 'public', color: 'text-blue-600' },
    { label: 'Politics', icon: 'account_balance', color: 'text-red-500' },
    { label: 'Business', icon: 'trending_up', color: 'text-emerald-600' },
    { label: 'Tech & Gadgets', icon: 'devices', color: 'text-cyan-500' },
    { label: 'Science', icon: 'biotech', color: 'text-purple-500' },
    { label: 'Health', icon: 'health_and_safety', color: 'text-rose-500' },
    { label: 'Sports', icon: 'sports_cricket', color: 'text-orange-500' },
    { label: 'Entertainment', icon: 'theater_comedy', color: 'text-pink-500' },
    { label: 'Education', icon: 'school', color: 'text-indigo-500' },
    { label: 'Automotive', icon: 'directions_car', color: 'text-slate-600' },
    { label: 'Environment', icon: 'eco', color: 'text-green-500' },
    { label: 'Crime', icon: 'security', color: 'text-gray-700' },
    { label: 'Lifestyle', icon: 'style', color: 'text-amber-500' },
    { label: 'Opinion', icon: 'rate_review', color: 'text-blue-400' },
    { label: 'Astro', icon: 'auto_awesome', color: 'text-yellow-600' },
    { label: 'Fact Check', icon: 'verified_user', color: 'text-teal-500' },
];

export default function QuickAccessPageV2() {
    const [scrollY, setScrollY] = useState(0);
    const [isNewsFullScreen, setIsNewsFullScreen] = useState(false);
    const [talkOpen, setTalkOpen] = useState(false);
    const [pillMessage, setPillMessage] = useState(null);
    const [expandedExplore, setExpandedExplore] = useState(false);
    const [menuAlign, setMenuAlign] = useState('left');
    const [dismissedIds, setDismissedIds] = useState([]);
    const containerRef = useRef(null);
    const pillTimerRef = useRef(null);
    const hasShownPillRef = useRef(false);

    // Animation refs for TOI logo animation
    const morningTextRef = useRef(null);
    const toiLogoRef = useRef(null);
    const wormholeBottomRef = useRef(null);
    const wormholeTopRef = useRef(null);
    const animationRef = useRef(null);

    // TOI Logo Animation Effect
    useEffect(() => {
        const morningText = morningTextRef.current;
        const toiLogo = toiLogoRef.current;
        const wormholeBottom = wormholeBottomRef.current;
        const wormholeTop = wormholeTopRef.current;

        if (!morningText || !toiLogo || !wormholeBottom || !wormholeTop) return;

        const animate = () => {
            // Recalculate widths on every loop to ensure accuracy after font loads or resizes
            const morningWidth = morningText.offsetWidth;
            const toiWidth = toiLogo.offsetWidth;

            const tl = gsap.timeline();

            // === MORNING TEXT ENTRANCE ===
            // Set wormhole width and reset morning text
            tl.set(wormholeBottom, { width: morningWidth + 'px' });
            tl.set(morningText, { y: '110%', opacity: 1, scale: 0.98 });

            // Wormhole appears with expansion
            tl.to(wormholeBottom, {
                opacity: 1,
                scaleX: 1.05,
                duration: 0.25,
                ease: 'power2.out'
            });

            // Morning text slides up smoothly
            tl.to(morningText, {
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.15');

            // Wormhole contracts and fades
            tl.to(wormholeBottom, {
                opacity: 0,
                scaleX: 0.9,
                duration: 0.35,
                ease: 'power2.in'
            }, '-=0.3');

            // Hold for 3 seconds
            tl.to({}, { duration: 3 });

            // === MORNING TEXT EXIT ===
            // Set wormhole width for exit
            tl.set(wormholeTop, { width: morningWidth + 'px', scaleX: 0.9 });

            // Wormhole expands at top
            tl.to(wormholeTop, {
                opacity: 1,
                scaleX: 1.05,
                duration: 0.25,
                ease: 'power2.out'
            });

            // Morning text accelerates upward smoothly
            tl.to(morningText, {
                y: '-110%',
                scale: 0.96,
                duration: 0.5,
                ease: 'power2.in'
            }, '-=0.15');

            // Wormhole fades and contracts
            tl.to(wormholeTop, {
                opacity: 0,
                scaleX: 0.9,
                duration: 0.35,
                ease: 'power2.in'
            }, '-=0.35');

            tl.set(morningText, { opacity: 0 });

            // Breathing pause
            tl.to({}, { duration: 0.15 });

            // === TOI ENTRANCE ===
            // Set wormhole width and reset TOI
            tl.set(wormholeBottom, { width: toiWidth + 'px', scaleX: 0.9 });
            tl.set(toiLogo, { y: '110%', opacity: 1, scale: 0.98 });

            // Wormhole appears with energy
            tl.to(wormholeBottom, {
                opacity: 1,
                scaleX: 1.05,
                duration: 0.25,
                ease: 'power2.out'
            });

            // TOI rises smoothly
            tl.to(toiLogo, {
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.15');

            // Wormhole contracts
            tl.to(wormholeBottom, {
                opacity: 0,
                scaleX: 0.9,
                duration: 0.35,
                ease: 'power2.in'
            }, '-=0.3');

            // Hold for 3 seconds
            tl.to({}, { duration: 3 });

            // === TOI EXIT ===
            // Set wormhole width for TOI exit
            tl.set(wormholeTop, { width: toiWidth + 'px', scaleX: 0.9 });

            // Wormhole opens
            tl.to(wormholeTop, {
                opacity: 1,
                scaleX: 1.05,
                duration: 0.25,
                ease: 'power2.out'
            });

            // TOI accelerates upward smoothly
            tl.to(toiLogo, {
                y: '-110%',
                scale: 0.96,
                duration: 0.5,
                ease: 'power2.in'
            }, '-=0.15');

            // Wormhole fades
            tl.to(wormholeTop, {
                opacity: 0,
                scaleX: 0.9,
                duration: 0.35,
                ease: 'power2.in'
            }, '-=0.35');

            tl.set(toiLogo, { opacity: 0 });

            // Seamless loop - restart immediately
            tl.eventCallback('onComplete', animate);

            animationRef.current = tl;
        };

        animate();

        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            setScrollY(scrollTop);

            if (scrollTop > 300) setIsNewsFullScreen(true);
            else setIsNewsFullScreen(false);
        };

        handleScroll();
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const triggerOrbPill = useCallback(() => {
        if (!hasShownPillRef.current) {
            hasShownPillRef.current = true;
            setPillMessage('Access categories instantly');
            setTalkOpen(true);

            if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
            pillTimerRef.current = setTimeout(() => {
                setPillMessage(null);
                setTalkOpen(false);
            }, 3000);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                if (!expandedExplore) {
                    setExpandedExplore(true);
                    triggerOrbPill();
                } else {
                    containerRef.current?.scrollTo({ top: 400, behavior: 'smooth' });
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [expandedExplore, triggerOrbPill]);

    const handleDismiss = useCallback((id) => {
        setDismissedIds((prev) => [...prev, id]);
    }, []);

    const visibleArticles = useMemo(
        () => ARTICLES.filter((a) => !dismissedIds.includes(a.id)),
        [dismissedIds],
    );

    const headerOpacity = Math.max(0, 1 - scrollY / 200);

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] bg-white"
            style={{ scrollBehavior: 'smooth' }}
        >
            {/* Header V2 - TOI is the trigger */}
            <div
                className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between"
                style={{
                    boxShadow: expandedExplore ? 'none' : '0 1px 0 rgba(0,0,0,0.05)',
                }}
            >
                <div
                    className="relative h-[60px] w-[320px] overflow-hidden cursor-pointer"
                    onClick={() => {
                        const newState = !expandedExplore;
                        setMenuAlign('left');
                        setExpandedExplore(newState);
                        if (newState) triggerOrbPill();
                    }}
                >
                    <div ref={wormholeBottomRef} className="absolute left-0 bottom-0 h-[1px] opacity-0 shadow-[0_0_8px_rgba(255,200,100,0.5)]"
                        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255, 200, 100, 0.6) 20%, rgba(255, 220, 150, 0.8) 50%, rgba(255, 200, 100, 0.6) 80%, transparent 100%)' }}
                    />
                    <div ref={wormholeTopRef} className="absolute left-0 top-0 h-[1px] opacity-0 shadow-[0_0_8px_rgba(255,200,100,0.5)]"
                        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255, 200, 100, 0.6) 20%, rgba(255, 220, 150, 0.8) 50%, rgba(255, 200, 100, 0.6) 80%, transparent 100%)' }}
                    />
                    <div ref={morningTextRef} className="absolute top-0 left-0 text-[26px] font-bold text-black leading-none whitespace-nowrap opacity-0 translate-y-full flex items-center h-full">
                        Good morning, Sharma
                    </div>
                    <div ref={toiLogoRef} className="absolute top-0 left-0 opacity-0 translate-y-full flex items-center h-full">
                        <div className="text-[28px] font-bold text-black tracking-wider leading-none font-serif">TOI</div>
                    </div>
                </div>

                <button
                    type="button"
                    className={cx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95",
                        expandedExplore && menuAlign === 'right' ? "bg-black text-white" : "hover:bg-gray-50 text-black"
                    )}
                    aria-label="Explore categories"
                    onClick={() => {
                        const newState = !expandedExplore;
                        setMenuAlign('right');
                        setExpandedExplore(newState);
                        if (newState) triggerOrbPill();
                    }}
                >
                    <Compass className="w-5 h-5" />
                </button>
            </div>

            {/* Floating Vertical Pill Menu */}
            <div
                className={cx(
                    "absolute left-0 right-0 z-30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    expandedExplore ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
                )}
                style={{ top: '68px' }}
            >
                <div className={cx(
                    "px-6 py-4 flex flex-col gap-3 h-[calc(100dvh-144px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] pb-10",
                    menuAlign === 'right' ? "items-end" : "items-start"
                )}>
                    {QUICK_ACCESS_ITEMS.map((item, idx) => (
                        <div
                            key={item.label}
                            className={cx(
                                "flex items-center gap-3.5 py-3.5 px-4 bg-white border border-gray-100/50 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-all cursor-pointer group shrink-0",
                                menuAlign === 'right' ? "flex-row-reverse text-right" : "flex-row"
                            )}
                            style={{
                                animation: expandedExplore ? `fade-in-up 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards ${idx * 0.03}s` : 'none',
                                opacity: 0,
                                transform: 'translateY(15px)'
                            }}
                        >
                            <div className={cx(
                                "w-9 h-9 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300",
                                item.color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100')
                            )}>
                                <span className={cx("material-icons text-[20px]", item.color)}>
                                    {item.icon}
                                </span>
                            </div>
                            <span className="text-sm sm:text-[15px] font-bold text-black/90 tracking-tight">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Content - shifts down when menu expanded */}
            <div
                className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                    transform: expandedExplore ? 'translateY(20px) scale(0.98)' : 'translateY(0) scale(1)',
                    opacity: expandedExplore ? 0.6 : 1,
                    pointerEvents: expandedExplore ? 'none' : 'auto'
                }}
            >
                {/* Icon Row */}
                <div className="px-4 sm:px-6 py-5">
                    <div className="flex justify-between items-start">
                        {[
                            { label: 'Astrologer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
                            { label: 'Money', char: 'A' },
                            { label: 'Discounts', icon: <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" /> },
                            { label: 'Games', icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></> },
                            { label: 'Upskill', icon: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /></> }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-[20%]">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                                    {item.img ? <img src={item.img} className="w-full h-full object-cover" alt="" /> :
                                        item.char ? <span className="text-4xl font-bold text-pink-400">{item.char}</span> :
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">{item.icon}</svg>}
                                </div>
                                <span className="text-[10px] sm:text-[11px] font-medium text-center text-gray-500">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Carousel */}
                <div className="px-4 sm:px-6 pb-6">
                    <div className="bg-blue-50/50 rounded-[32px] p-6 flex gap-4 items-center">
                        <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-bold leading-[1.3] text-gray-900 mb-2">
                                Apple announces Vision Pro 2 with lighter design and wider field of view
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                <span>Tech</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span>2h ago</span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <img src="https://images.unsplash.com/photo-1617802690992-15d51b5e5b6d?w=200&h=150&fit=crop" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl shadow-lg" alt="" />
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="px-4 sm:px-6">
                    <div className="flex items-center gap-8 border-b border-gray-100 mb-2">
                        <div className="flex flex-col items-center pt-2">
                            <span className="font-bold text-black pb-3 px-1">Top News</span>
                            <div className="w-full h-[3px] bg-black rounded-full" />
                        </div>
                        <span className="font-medium text-gray-400 pb-2">For You</span>
                    </div>

                    {visibleArticles.map((article) => (
                        <div key={article.id} className="py-6 border-b border-gray-50 animate-in fade-in duration-700">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{article.category}</span>
                                <div className="flex-1" />
                                <button onClick={() => handleDismiss(article.id)} className="p-1 hover:bg-gray-100 rounded-lg">
                                    <X className="w-4 h-4 text-gray-300" />
                                </button>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold leading-tight text-gray-900 mb-4">{article.title}</h3>
                            {article.hasImage && (
                                <img src={`https://images.unsplash.com/photo-${1650000000000 + article.id * 1000000}?w=600&h=300&fit=crop`} className="w-full h-48 sm:h-64 object-cover rounded-[24px] mb-4 shadow-sm" alt="" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Talk to Us Widget (Original z-index stays high) */}
            <button
                type="button"
                onClick={() => {
                    if (pillMessage) return;
                    setTalkOpen(!talkOpen);
                }}
                className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-0 z-[50]"
                style={{
                    width: talkOpen ? (pillMessage ? '220px' : '180px') : '56px',
                    height: '56px',
                    borderRadius: '28px',
                    transform: talkOpen ? 'translateX(-12px)' : 'translateX(28px)',
                    transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1), background-color 0.4s ease',
                    backgroundColor: talkOpen ? (pillMessage ? '#00d68f' : '#2563eb') : '#ffffff',
                    color: talkOpen ? '#ffffff' : '#1e1e1e',
                    boxShadow: talkOpen
                        ? (pillMessage ? '0 4px 24px rgba(0,214,143,0.4)' : '0 4px 24px rgba(37,99,235,0.4)')
                        : '0 4px 20px rgba(0,0,0,0.1)',
                    animation: talkOpen ? 'none' : 'orb-glow 4s ease-in-out infinite',
                    overflow: 'hidden',
                }}
            >
                {/* Siri-like blobs */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: talkOpen ? 0 : 1,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                    }}
                >
                    <div style={{ position: 'absolute', width: '32px', height: '32px', background: 'radial-gradient(circle, #6366f1 0%, rgba(99,102,241,0.7) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(4px)', top: '6px', left: '2px', animation: 'siri-1 3s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', width: '30px', height: '30px', background: 'radial-gradient(circle, #ec4899 0%, rgba(236,72,153,0.75) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(4px)', top: '18px', left: '12px', animation: 'siri-2 4s ease-in-out infinite' }} />
                </div>

                <div
                    className="flex items-center justify-center gap-2 h-full px-4"
                    style={{
                        opacity: talkOpen ? 1 : 0,
                        transform: talkOpen ? 'scale(1)' : 'scale(0.6)',
                        transition: 'opacity 0.25s ease, transform 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                    }}
                >
                    {pillMessage ? (
                        <Compass className="shrink-0 w-[18px] h-[18px]" strokeWidth={2.5} />
                    ) : (
                        <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    )}
                    <span className={pillMessage ? "text-xs font-semibold" : "text-sm font-bold"}>
                        {pillMessage || 'Talk to us'}
                    </span>
                </div>
            </button>
        </div>
    );
}
