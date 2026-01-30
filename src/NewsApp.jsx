import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

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
  { id: 11, category: 'Health', title: 'WHO declares new mpox variant under monitoring after cases reported in Southeast Asia', hasImage: true },
  { id: 12, category: 'Business', title: 'Reliance Jio launches satellite broadband service at ₹499/month, targets rural India', hasGrid: true },
  { id: 13, category: 'World', title: 'Trump proposes 60% tariff on Chinese EVs, Beijing warns of retaliatory measures', hasImage: true },
  { id: 14, category: 'Sports', title: "India women's cricket team wins inaugural T20 Champions Trophy, beats Australia in final", hasGrid: true },
  { id: 15, category: 'India', title: 'Supreme Court upholds new criminal law reforms, sets implementation timeline for states', hasImage: true },
  { id: 16, category: 'Tech', title: 'OpenAI releases GPT-5 with PhD-level reasoning, available free for education sector', hasGrid: true },
  { id: 17, category: 'Entertainment', title: 'Dune: Part Three announced by Denis Villeneuve, filming begins in Jordan this summer', hasImage: true },
  { id: 18, category: 'Science', title: 'NASA confirms water ice deposits on lunar south pole, boosts Artemis mission plans', hasGrid: true },
  { id: 19, category: 'Business', title: 'Tata Motors overtakes Hyundai as India second largest carmaker by volume', hasImage: true },
  { id: 20, category: 'World', title: 'Ukraine and Russia agree to 90-day ceasefire brokered by India and Turkey at UN summit', hasGrid: true },
];

const GRID_IMAGES = [
  ['https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200&h=150&fit=crop'],
  ['https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&h=150&fit=crop'],
  ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop'],
  ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=150&fit=crop'],
  ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1461896836934-bd45ba3b23c0?w=200&h=150&fit=crop'],
];

export default function NewsApp() {
  const [scrollY, setScrollY] = useState(0);
  const [isNewsFullScreen, setIsNewsFullScreen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(true);
  const [pillMessage, setPillMessage] = useState(null);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [orbMode, setOrbMode] = useState(null); // null | 'stories' | 'gratitude'
  const dismissCountRef = useRef(0);
  const pillTimerRef = useRef(null);
  const containerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const storiesShownRef = useRef(false);

  const pastCarousel = scrollY > 150;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrollY(scrollTop);

      if (scrollTop > 300) setIsNewsFullScreen(true);
      else setIsNewsFullScreen(false);

      // Reset idle timer on every scroll event
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      // Start 3s idle timer when scrolled past carousel
      if (scrollTop > 150 && !storiesShownRef.current) {
        idleTimerRef.current = setTimeout(() => {
          if (!storiesShownRef.current) {
            storiesShownRef.current = true;
            setPillMessage(null);
            setOrbMode('stories');
            setTalkOpen(true);
          }
        }, 3000);
      }
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // When past carousel, auto-collapse. When back above, auto-expand.
  useEffect(() => {
    if (pastCarousel) {
      // Don't collapse if showing a special mode
      if (!orbMode && !pillMessage) setTalkOpen(false);
    } else {
      if (orbMode !== 'gratitude') {
        setTalkOpen(true);
        setOrbMode(null);
        storiesShownRef.current = false;
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    }
  }, [pastCarousel, orbMode, pillMessage]);

  const handleDismiss = useCallback((id) => {
    setDismissedIds((prev) => [...prev, id]);
    dismissCountRef.current += 1;

    if (dismissCountRef.current === 3) {
      dismissCountRef.current = 0;
      setPillMessage('Thanks! Your feedback helps us improve.');
      setTalkOpen(true);

      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
      pillTimerRef.current = setTimeout(() => {
        setPillMessage(null);
        setTalkOpen(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const visibleArticles = useMemo(
    () => ARTICLES.filter((a) => !dismissedIds.includes(a.id)),
    [dismissedIds],
  );

  const headerOpacity = Math.max(0, 1 - scrollY / 200);
  const carouselOpacity = Math.max(0, 1 - scrollY / 150);
  const carouselTranslate = Math.min(scrollY * 0.5, 150);

  // Orb display properties
  const orbText = pillMessage
    || (orbMode === 'stories' ? 'Fresh stories picked for you'
      : orbMode === 'gratitude' ? 'There you go! Happy reading'
      : 'Talk to us');
  const orbTextSmall = !!pillMessage || orbMode === 'gratitude';
  const orbShowChevron = !pillMessage && !orbMode;
  const orbContentKey = pillMessage || orbMode || 'default';
  const orbExpandedWidth = pillMessage
    ? '320px'
    : orbMode === 'stories' || orbMode === 'gratitude'
      ? '280px'
      : '180px';

  return (
    <div className="h-dvh w-full bg-[#e8d5c4] overflow-hidden">
      {/* Main Content */}
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
          <h1 className="text-2xl font-serif font-bold leading-none">TOI</h1>
          <div className="flex-1" />
          <button
            type="button"
            className="w-10 h-10 -mr-2 grid place-items-center rounded-full active:scale-[0.98]"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
          <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-5 flex gap-4 items-start">
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
            'bg-white rounded-t-3xl transition-all',
            isNewsFullScreen ? '-mt-5 min-h-dvh' : '',
          )}
        >
          {/* Tabs */}
          <div className="flex justify-around items-center pt-5 pb-3 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-10">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[17px]">Top News</span>
              <div className="w-20 h-1 bg-black mt-2 rounded-full" />
            </div>
            <span className="text-[17px] text-gray-500">For You</span>
            <span className="text-[17px] text-gray-500">ePaper</span>
          </div>

          {/* News Articles */}
          <div className="pb-[calc(110px+env(safe-area-inset-bottom))]">
            {visibleArticles.map((article, idx) => {
              const gridIdx = idx % GRID_IMAGES.length;
              return (
                <div key={article.id} className="px-4 sm:px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">{article.category}</span>
                    <button
                      type="button"
                      className="px-4 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 active:scale-[0.98]"
                    >
                      Follow
                    </button>
                    <button
                      type="button"
                      className="ml-auto p-2 -mr-2 rounded-full active:scale-[0.98]"
                      aria-label="Dismiss"
                      onClick={() => handleDismiss(article.id)}
                    >
                      <X className="w-5 h-5 text-gray-400" />
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
                          className="w-28 h-20 sm:w-32 sm:h-24 object-cover rounded-lg bg-gray-100"
                        />
                      </div>
                    )}
                  </div>

                  {article.hasGrid && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <ImageWithFallback
                        src={GRID_IMAGES[gridIdx][0]}
                        alt="Article media 1"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg"
                      />
                      <ImageWithFallback
                        src={GRID_IMAGES[gridIdx][1]}
                        alt="Article media 2"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Siri Orb - half-circle peeking from right edge */}
        <button
          type="button"
          onClick={() => {
            if (pillMessage || orbMode === 'gratitude') return;

            if (orbMode === 'stories') {
              containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              setOrbMode('gratitude');
              if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
              pillTimerRef.current = setTimeout(() => {
                setOrbMode(null);
              }, 2500);
              return;
            }

            setTalkOpen((v) => !v);
          }}
          className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-0 z-20"
          style={{
            width: talkOpen ? orbExpandedWidth : '56px',
            height: '56px',
            borderRadius: '28px',
            transform: talkOpen ? 'translateX(-12px)' : 'translateX(28px)',
            transition:
              'width 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1), background-color 0.4s ease, box-shadow 0.4s ease, color 0.3s ease',
            backgroundColor: talkOpen
              ? (pillMessage || orbMode === 'gratitude')
                ? '#00d68f'
                : '#2563eb'
              : '#ffffff',
            color: talkOpen ? '#ffffff' : '#1e1e1e',
            boxShadow: talkOpen
              ? (pillMessage || orbMode === 'gratitude')
                ? '0 4px 24px rgba(0,214,143,0.5), 0 0 40px rgba(0,214,143,0.2)'
                : '0 4px 24px rgba(37,99,235,0.5), 0 0 40px rgba(37,99,235,0.2)'
              : undefined,
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
            {/* Vivid blue */}
            <div
              style={{
                position: 'absolute',
                width: '32px',
                height: '32px',
                background:
                  'radial-gradient(circle, #6366f1 0%, rgba(99,102,241,0.7) 40%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(4px)',
                top: '6px',
                left: '2px',
                animation: 'siri-1 3s ease-in-out infinite',
              }}
            />
            {/* Hot pink */}
            <div
              style={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                background:
                  'radial-gradient(circle, #ec4899 0%, rgba(236,72,153,0.75) 40%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(4px)',
                top: '18px',
                left: '12px',
                animation: 'siri-2 4s ease-in-out infinite',
              }}
            />
            {/* Bright cyan */}
            <div
              style={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                background:
                  'radial-gradient(circle, #06b6d4 0%, rgba(6,182,212,0.75) 40%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(4px)',
                top: '2px',
                left: '16px',
                animation: 'siri-3 3.5s ease-in-out infinite',
              }}
            />
            {/* Rich violet */}
            <div
              style={{
                position: 'absolute',
                width: '28px',
                height: '28px',
                background:
                  'radial-gradient(circle, #a855f7 0%, rgba(168,85,247,0.8) 40%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(3px)',
                top: '22px',
                left: '0px',
                animation: 'siri-4 4.5s ease-in-out infinite',
              }}
            />
            {/* Bright emerald */}
            <div
              style={{
                position: 'absolute',
                width: '26px',
                height: '26px',
                background:
                  'radial-gradient(circle, #10b981 0%, rgba(16,185,129,0.75) 40%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(3px)',
                top: '10px',
                left: '22px',
                animation: 'siri-1 5s ease-in-out infinite reverse',
              }}
            />
          </div>

          {/* Expanded content - scales out from the orb */}
          <div
            className="flex items-center gap-2 w-full justify-center"
            style={{
              opacity: talkOpen ? 1 : 0,
              transform: talkOpen ? 'scale(1)' : 'scale(0.6)',
              transformOrigin: 'right center',
              transition: 'opacity 0.25s ease, transform 0.3s ease',
              transitionDelay: talkOpen ? '0.2s' : '0s',
              whiteSpace: 'nowrap',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Icon changes based on mode */}
            {orbMode === 'stories' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            ) : orbMode === 'gratitude' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.4 5.7 21l2.3-7L2 9.4h7.6z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            )}
            <span
              key={orbContentKey}
              className={orbTextSmall ? 'text-xs font-medium' : 'text-sm font-bold'}
              style={{ animation: 'orb-text-in 0.3s ease-out' }}
            >
              {orbText}
            </span>
            {orbShowChevron && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        </button>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center text-black">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-xs font-bold mt-1">Newsfeed</span>
            </div>
            <div className="flex flex-col items-center text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M9 10h6m-3-3v6" />
              </svg>
              <span className="text-xs mt-1">Markets</span>
            </div>
            <div className="flex flex-col items-center text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              <span className="text-xs mt-1">Store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
