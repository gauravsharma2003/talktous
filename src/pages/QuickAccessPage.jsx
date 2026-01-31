import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

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

export default function QuickAccessPage() {
    const [scrollY, setScrollY] = useState(0);
    const [isNewsFullScreen, setIsNewsFullScreen] = useState(false);
    const [talkOpen, setTalkOpen] = useState(false);
    const [pillMessage, setPillMessage] = useState(null);
    const [expandedExplore, setExpandedExplore] = useState(false);
    const [dismissedIds, setDismissedIds] = useState([]);
    const containerRef = useRef(null);
    const pillTimerRef = useRef(null);
    const hasShownPillRef = useRef(false);
    const [showCoachMark, setShowCoachMark] = useState(false);

    useEffect(() => {
        const hasShown = sessionStorage.getItem('hasShownQuickAccessCoachMark');
        if (!hasShown) {
            setShowCoachMark(true);
        }
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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                // Snap to header
                containerRef.current?.scrollTo({ top: 420, behavior: 'smooth' });

                // Once per session orb expansion
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
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (expandedExplore && !hasShownPillRef.current) {
            hasShownPillRef.current = true;
            setPillMessage('Access categories instantly');
            setTalkOpen(true);

            if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
            pillTimerRef.current = setTimeout(() => {
                setPillMessage(null);
                setTalkOpen(false);
            }, 3000);
        }
    }, [expandedExplore]);

    useEffect(() => {
        return () => {
            if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
        };
    }, []);

    const handleDismiss = useCallback((id) => {
        setDismissedIds((prev) => [...prev, id]);
    }, []);

    const visibleArticles = useMemo(
        () => ARTICLES.filter((a) => !dismissedIds.includes(a.id)),
        [dismissedIds],
    );

    const headerOpacity = Math.max(0, 1 - scrollY / 200);
    const carouselOpacity = Math.max(0, 1 - scrollY / 150);
    const carouselTranslate = Math.min(scrollY * 0.5, 150);

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none]"
            style={{ scrollBehavior: 'smooth' }}
        >
            {/* Header - fades out on scroll */}
            <div
                className="px-4 sm:px-6 py-4 flex items-center justify-between transition-opacity"
                style={{
                    opacity: headerOpacity,
                    transform: `translateY(-${Math.min(scrollY * 0.3, 50)}px)`,
                }}
            >
                <h1 className="text-2xl font-serif font-bold leading-none text-black">TOI</h1>
                <div className="flex-1" />
                <button
                    type="button"
                    className="w-10 h-10 -mr-2 grid place-items-center rounded-full active:scale-[0.98]"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6 text-black" />
                </button>
            </div>

            {/* Icon Row - fades out on scroll */}
            <div
                className="px-4 sm:px-6 pb-5 transition-opacity"
                style={{
                    opacity: headerOpacity,
                    transform: `translateY(-${carouselTranslate}px)`,
                }}
            >
                <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center gap-2 w-[20%]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 overflow-hidden">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                                alt="Talk to Astrologer"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-[11px] leading-tight text-center text-black/80">
                            Talk to
                            <br />
                            Astrologer
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-[20%]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <span className="text-4xl font-bold text-pink-400">A</span>
                        </div>
                        <span className="text-[11px] leading-tight text-center text-black/80">
                            Send
                            <br />
                            Money
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-[20%]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-black">
                                <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
                            </svg>
                        </div>
                        <span className="text-[11px] leading-tight text-center text-black/80">
                            Discounts
                            <br />
                            on OTT
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-[20%]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-black">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                            </svg>
                        </div>
                        <span className="text-[11px] leading-tight text-center text-black/80">
                            Play
                            <br />
                            Games
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-[20%]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-black">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                            </svg>
                        </div>
                        <span className="text-[11px] leading-tight text-center text-black/80">
                            Upskill
                            <br />
                            Masterclass
                        </span>
                    </div>
                </div>
            </div>

            {/* Carousel - fades and translates up */}
            <div
                className="px-4 sm:px-6 pb-5 transition-all"
                style={{
                    opacity: carouselOpacity,
                    transform: `translateY(-${carouselTranslate}px)`,
                }}
            >
                <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-5 flex gap-4 items-start shadow-sm">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[17px] sm:text-xl font-semibold leading-snug text-black">
                            Apple announces Vision Pro 2 with lighter design and wider field of view, shipping in Fall
                        </h2>
                    </div>
                    <div className="shrink-0">
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1617802690992-15d51b5e5b6d?w=200&h=150&fit=crop"
                            alt="Vision Pro 2"
                            className="w-32 h-24 sm:w-48 sm:h-32 object-cover rounded-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* News Section */}
            <div
                className={cx(
                    'bg-white rounded-t-3xl transition-all shadow-[0_-8px_30px_rgb(0,0,0,0.04)]',
                    isNewsFullScreen ? '-mt-5 min-h-dvh' : '',
                )}
            >
                {/* Sticky Header Section (Tabs + Expanded Grid) */}
                <div className="sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-gray-100 rounded-t-3xl">
                    {/* Tabs */}
                    <div className="flex items-center pt-4 pb-2 pl-10 pr-6">
                        <div className="flex items-center gap-24">
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-[17px] text-black">Top News</span>
                                <div className="w-10 h-1 bg-black mt-2 rounded-full" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[17px] font-medium text-gray-400">For You</span>
                                <div className="w-10 h-1 bg-transparent mt-2 rounded-full" />
                            </div>
                        </div>
                        <div className="flex-1" />
                        <div className="relative">
                            {showCoachMark && (
                                <>
                                    {/* Overlay that dims the screen slightly but lets the button shine */}
                                    <div
                                        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-500"
                                        onClick={() => {
                                            setShowCoachMark(false);
                                            sessionStorage.setItem('hasShownQuickAccessCoachMark', 'true');
                                        }}
                                    />

                                    {/* Tooltip explaining the button */}
                                    <div className="absolute bottom-full right-0 mb-4 z-50 animate-in slide-in-from-bottom-2 duration-500">
                                        <div className="bg-blue-600 text-white text-[13px] font-bold px-4 py-2 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-2" style={{ animation: 'tooltip-float 2s ease-in-out infinite' }}>
                                            <span className="material-icons text-[16px]">info</span>
                                            Explore more sections
                                            <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-600" />
                                        </div>
                                    </div>

                                    {/* Pulsing focal ring */}
                                    <div className="coach-mark-pulse z-50" />
                                </>
                            )}
                            <button
                                onClick={() => {
                                    const nextExpanded = !expandedExplore;
                                    setExpandedExplore(nextExpanded);

                                    // Snap to header when expanding
                                    if (nextExpanded) {
                                        containerRef.current?.scrollTo({ top: 420, behavior: 'smooth' });
                                    }

                                    if (showCoachMark) {
                                        setShowCoachMark(false);
                                        sessionStorage.setItem('hasShownQuickAccessCoachMark', 'true');
                                    }
                                }}
                                className={cx(
                                    "p-2 -mr-2 rounded-full hover:bg-gray-50 transition-all active:scale-95 relative z-50",
                                    showCoachMark ? "bg-white shadow-lg ring-4 ring-blue-500/20" : ""
                                )}
                                aria-label="Toggle explore more"
                            >
                                {expandedExplore ? (
                                    <ChevronUp className="w-6 h-6 text-black" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-black" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Grid Section - Sticky with Tabs */}
                    <div
                        className={cx(
                            "transition-all duration-500 ease-in-out overflow-hidden pl-2 pr-0",
                            expandedExplore ? "max-h-[300px] pb-5" : "max-h-0"
                        )}
                    >
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.1em]">Quick Access</h2>
                            <div className="grid grid-rows-2 grid-flow-col gap-2 overflow-x-auto [scrollbar-width:none] pb-2 pr-10">
                                {QUICK_ACCESS_ITEMS.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full border border-gray-100/50 min-w-max whitespace-nowrap active:scale-95 transition-transform cursor-pointer hover:bg-gray-100"
                                    >
                                        <span className={cx("material-icons text-[18px]", item.color)}>
                                            {item.icon}
                                        </span>
                                        <span className="text-[13px] font-bold text-black/80">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Feed */}
                <div className="pb-[calc(110px+env(safe-area-inset-bottom))]">
                    {visibleArticles.map((article, idx) => {
                        const gridIdx = idx % GRID_IMAGES.length;
                        return (
                            <div key={article.id} className="px-4 sm:px-6 py-5 border-b border-gray-50">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm text-gray-400 font-medium">{article.category}</span>
                                    <button
                                        type="button"
                                        className="px-4 py-1 bg-gray-50 rounded-full text-xs font-semibold text-gray-600 active:scale-[0.98]"
                                    >
                                        Follow
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-auto p-2 -mr-2 rounded-full active:scale-[0.98]"
                                        aria-label="Dismiss"
                                        onClick={() => handleDismiss(article.id)}
                                    >
                                        <X className="w-5 h-5 text-gray-200" />
                                    </button>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[17px] sm:text-lg font-semibold leading-snug text-black">
                                            {article.title}
                                        </h3>
                                    </div>

                                    {article.hasImage && (
                                        <div className="shrink-0">
                                            <ImageWithFallback
                                                src={`https://images.unsplash.com/photo-${1650000000000 + article.id * 1000000}?w=150&h=100&fit=crop`}
                                                alt="Article"
                                                className="w-28 h-20 sm:w-32 sm:h-24 object-cover rounded-xl bg-gray-50"
                                            />
                                        </div>
                                    )}
                                </div>

                                {article.hasGrid && (
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <ImageWithFallback
                                            src={GRID_IMAGES[gridIdx][0]}
                                            alt="Article media 1"
                                            className="w-full h-28 sm:h-32 object-cover rounded-xl"
                                        />
                                        <ImageWithFallback
                                            src={GRID_IMAGES[gridIdx][1]}
                                            alt="Article media 2"
                                            className="w-full h-28 sm:h-32 object-cover rounded-xl"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Talk to Us Widget */}
            <button
                type="button"
                onClick={() => {
                    if (pillMessage) return;
                    setTalkOpen(!talkOpen);
                }}
                className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-0 z-20"
                style={{
                    width: talkOpen ? (pillMessage ? '220px' : '180px') : '56px',
                    height: '56px',
                    borderRadius: '28px',
                    transform: talkOpen ? 'translateX(-12px)' : 'translateX(28px)',
                    transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1), background-color 0.4s ease, box-shadow 0.4s ease, color 0.3s ease',
                    backgroundColor: talkOpen ? (pillMessage ? '#00d68f' : '#2563eb') : '#ffffff',
                    color: talkOpen ? '#ffffff' : '#1e1e1e',
                    boxShadow: talkOpen
                        ? (pillMessage ? '0 4px 24px rgba(0,214,143,0.5), 0 0 40px rgba(0,214,143,0.2)' : '0 4px 24px rgba(37,99,235,0.5), 0 0 40px rgba(37,99,235,0.2)')
                        : '0 4px 20px rgba(0,0,0,0.1)',
                    animation: talkOpen ? 'none' : 'orb-glow 4s ease-in-out infinite',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
            >
                {/* Siri-like animated blobs */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        overflow: 'hidden',
                        opacity: talkOpen ? 0 : 1,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                    }}
                >
                    <div style={{ position: 'absolute', width: '32px', height: '32px', background: 'radial-gradient(circle, #6366f1 0%, rgba(99,102,241,0.7) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(4px)', top: '6px', left: '2px', animation: 'siri-1 3s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', width: '30px', height: '30px', background: 'radial-gradient(circle, #ec4899 0%, rgba(236,72,153,0.75) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(4px)', top: '18px', left: '12px', animation: 'siri-2 4s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', width: '30px', height: '30px', background: 'radial-gradient(circle, #06b6d4 0%, rgba(6,182,212,0.75) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(4px)', top: '2px', left: '16px', animation: 'siri-3 3.5s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', width: '28px', height: '28px', background: 'radial-gradient(circle, #a855f7 0%, rgba(168,85,247,0.8) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(3px)', top: '22px', left: '0px', animation: 'siri-4 4.5s ease-in-out infinite' }} />
                </div>

                <div
                    className="flex items-center justify-center gap-2 h-full px-4"
                    style={{
                        opacity: talkOpen ? 1 : 0,
                        transform: talkOpen ? 'scale(1)' : 'scale(0.6)',
                        transition: 'opacity 0.25s ease, transform 0.3s ease',
                        transitionDelay: talkOpen ? '0.2s' : '0s',
                        whiteSpace: 'nowrap',
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                    }}
                >
                    {pillMessage ? (
                        <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m16.24 7.76-1.41 4.95-4.95 1.41 1.41-4.95 4.95-1.41z" />
                        </svg>
                    ) : (
                        <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    )}
                    <span
                        className={pillMessage ? "text-xs font-semibold" : "text-sm font-bold"}
                        style={{ animation: 'orb-text-in 0.3s ease-out' }}
                    >
                        {pillMessage || 'Talk to us'}
                    </span>
                    {!pillMessage && (
                        <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    )}
                </div>
            </button>
        </div>
    );
}
