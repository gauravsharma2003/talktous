import React, { useEffect, useMemo, useRef, useState } from 'react';
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

export default function NewsApp() {
  const [scrollY, setScrollY] = useState(0);
  const [isNewsFullScreen, setIsNewsFullScreen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrollY(scrollTop);

      if (scrollTop > 300) setIsNewsFullScreen(true);
      else setIsNewsFullScreen(false);

      // Auto-collapse "Talk to us" when scrolled past carousel
      if (scrollTop > 150) setTalkOpen(false);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const headerOpacity = Math.max(0, 1 - scrollY / 200);
  const carouselOpacity = Math.max(0, 1 - scrollY / 150);
  const carouselTranslate = Math.min(scrollY * 0.5, 150);

  const articles = useMemo(() => [1, 2, 3, 4, 5], []);

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
            {articles.map((item) => (
              <div key={item} className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500">World</span>
                  <button
                    type="button"
                    className="px-4 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 active:scale-[0.98]"
                  >
                    Follow
                  </button>
                  <button type="button" className="ml-auto p-2 -mr-2 rounded-full active:scale-[0.98]" aria-label="Dismiss">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] sm:text-lg font-semibold leading-snug text-black">
                      {"'In mutually convenient manner': Can Russia-India-China troika be revived? MEA responds to Russia's push"}
                    </h3>
                  </div>

                  {item % 2 === 1 && (
                    <div className="shrink-0">
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-${1650000000000 + item * 1000000}?w=150&h=100&fit=crop`}
                        alt="Article"
                        className="w-28 h-20 sm:w-32 sm:h-24 object-cover rounded-lg bg-gray-100"
                      />
                    </div>
                  )}
                </div>

                {item % 2 === 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=200&h=150&fit=crop"
                      alt="Article media 1"
                      className="w-full h-28 sm:h-32 object-cover rounded-lg"
                    />
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200&h=150&fit=crop"
                      alt="Article media 2"
                      className="w-full h-28 sm:h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Talk to us - slides from right wall */}
          {/* Talk to us - slides from right wall */}
          <button
            type="button"
            onClick={() => setTalkOpen((v) => !v)}
            className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-0 bg-blue-500 text-white rounded-l-full flex items-center shadow-md active:scale-[0.98] overflow-hidden z-20"
            style={{
              transform: talkOpen
                ? 'translateX(0)'
                : 'translateX(calc(100% - 24px))',
              transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <span className="w-6 h-9 flex items-center justify-center shrink-0 text-white/90 text-xs font-bold">
              {talkOpen ? '\u203A' : '\u2039'}
            </span>
            <div className="flex items-center gap-1.5 pr-3 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-xs font-semibold whitespace-nowrap">Talk to us</span>
            </div>
          </button>
        </div>

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

