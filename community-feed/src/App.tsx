import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Search,
  Heart,
  MessageCircle,
  Share2,
  UploadCloud,
  UserRound,
  Compass,
  CircleHelp,
  Radio,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

type Clip = {
  id: string;
  title: string;
  category: string;
  src: string;
  fallbacks: string[];
};
const r2Objects = [
  { key: 'itworldjersey-videos/blue-skyblue/vid-102602.mp4', title: 'Sky blue jersey', category: 'New arrivals' },
  { key: 'itworldjersey-videos/blue/vid-102603.mp4', title: 'Blue jersey design', category: 'Jersey culture' },
  { key: 'itworldjersey-videos/blue/vid-102608.mp4', title: 'Blue jersey collection', category: 'New arrivals' },
  { key: 'itworldjersey-videos/blue/vid-102611.mp4', title: 'Blue jersey detail', category: 'Design ideas' },
  { key: 'itworldjersey-videos/green-gray/vid-102601.mp4', title: 'Green and gray jersey', category: 'Jersey culture' },
  { key: 'itworldjersey-videos/red-blue/vid-102614.mp4', title: 'Red and blue jersey', category: 'New arrivals' },
  { key: 'itworldjersey-videos/red-blue/🏆 အိုင်တီကမ္ဘာ အားကစားဝတ်စုံ 🏆 👕 အထည်ချုပ်ပင်ရင်း • ဒိုင.mp4', title: 'IT WORLD jersey showcase', category: 'Store review' },
  { key: 'itworldjersey-videos/red-brown/vid-102604.mp4', title: 'Red and brown jersey', category: 'Design ideas' },
  { key: 'itworldjersey-videos/red/vid-102610.mp4', title: 'Red jersey collection', category: 'New arrivals' },
  { key: 'itworldjersey-videos/red/vid-102613.mp4', title: 'Red jersey design', category: 'Jersey culture' },
  { key: 'itworldjersey-videos/red/🏆 အိုင်တီကမ္ဘာ အားကစားဝတ်စုံ 🏆 👕 အထည်ချုပ်ပင်ရင်း • ဒို_3.mp4', title: 'IT WORLD red jersey', category: 'Store review' },
  { key: 'itworldjersey-videos/store-review/🏆 အိုင်တီကမ္ဘာ အားကစားဝတ်စုံ 🏆 👕 အထည်ချုပ်ပင်ရင်း • ဒို_2.mp4', title: 'IT WORLD store review', category: 'Store review' },
  { key: 'itworldjersey-videos/white/vid-102605.mp4', title: 'White jersey collection', category: 'New arrivals' },
  { key: 'itworldjersey-videos/white/vid-102606.mp4', title: 'White jersey design', category: 'Jersey culture' },
  { key: 'itworldjersey-videos/white/vid-102607.mp4', title: 'White jersey details', category: 'Design ideas' },
  { key: 'itworldjersey-videos/white/vid-102612.mp4', title: 'White jersey showcase', category: 'New arrivals' },
  { key: 'itworldjersey-videos/white/🏆 အိုင်တီကမ္ဘာ အားကစားဝတ်စုံ 🏆 👕 အထည်ချုပ်ပင်ရင်း • ဒို_1.mp4', title: 'IT WORLD white jersey', category: 'Store review' },
  { key: 'itworldjersey-videos/yellow/vid-102609.mp4', title: 'Yellow jersey collection', category: 'Design ideas' },
];
const clips: Clip[] = r2Objects.map((item, index) => ({
  id: `r2-${index + 1}`,
  title: item.title,
  category: item.category,
  src: `https://vid.itworldlive.stream/${item.key.split('/').map(part => encodeURIComponent(part)).join('/')}`,
  fallbacks: [
    `https://vid.itworldlive.stream/${item.key.split('/').slice(1).map(part => encodeURIComponent(part)).join('/')}`,
    `https://media.itworldlive.stream/${item.key.split('/').map(part => encodeURIComponent(part)).join('/')}`,
    `https://pub-b0d511ea0d9c42a3bcb6558724681719.r2.dev/${item.key.split('/').map(part => encodeURIComponent(part)).join('/')}`,
  ],
}));

export default function App() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('For you');
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(() => new Set());
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [localComments, setLocalComments] = useState<Record<string, string[]>>({});
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const toggleLike = (id: string) => setLikedVideos(previous => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const shareClip = async (clip: Clip) => {
    const shareUrl = `${window.location.origin}/?video=${encodeURIComponent(clip.id)}`;
    try {
      if (navigator.share) await navigator.share({ title: clip.title, text: 'Watch this on IT WORLD COMMUNITY', url: shareUrl });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(shareUrl); alert('Video link copied.'); }
      else alert(shareUrl);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) alert('Share this link: ' + shareUrl);
    }
  };
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);
    if (!('IntersectionObserver' in window)) {
      const first = videos[0];
      if (first && first.dataset.primary && !first.dataset.loaded) {
        first.src = first.dataset.primary;
        first.dataset.loaded = 'true';
        first.load();
      }
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const current = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          const visibleIndex = videos.indexOf(current);
          if (visibleIndex >= 0) setActiveVideoIndex(visibleIndex);
          for (const other of videos) {
            if (other !== current) { other.pause(); other.muted = true; }
          }
          if (!current.dataset.loaded && current.dataset.primary) {
            current.src = current.dataset.primary;
            current.dataset.loaded = 'true';
            current.load();
          }
          current.muted = false;
          current.volume = 1;
          void current.play().catch(() => {});
        } else {
          current.pause();
          current.muted = true;
        }
      }
    }, { threshold: [0, 0.65, 1] });
    videos.forEach(video => observer.observe(video));
    return () => observer.disconnect();
  }, []);
  const filtered = useMemo(
    () =>
      clips.filter(c =>
        (c.title + c.category).toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  return (
    <div className="min-h-screen bg-[#08090c] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#08090c]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-3 no-underline">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f04444] shadow-lg shadow-red-950/40">
              <Play size={21} fill="white" strokeWidth={1.5} />
            </span>
            <span>
              <span className="block text-[11px] font-black tracking-[.26em] text-[#ff6464]">
                IT WORLD
              </span>
              <span className="block text-[13px] font-black leading-5 tracking-[.18em] text-white">
                COMMUNITY
              </span>
            </span>
          </a>
          <nav aria-label="Primary navigation" className="hidden items-center gap-2 lg:flex">
            <a href="#feed" className="rounded-full bg-[#f04444]/15 px-3 py-2 text-xs font-extrabold text-[#ff7777] no-underline">Videos 🎬</a>
            <a href="https://itworldlive.stream/" className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/75 no-underline hover:text-white">Live 🔴</a>
            <a href="#social" className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/75 no-underline hover:text-white">Social 🪩</a>
          </nav>
          <div className="hidden w-full max-w-sm items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2.5 md:flex">
            <Search size={17} className="text-white/50" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search jersey videos"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/65">
              <Radio size={13} className="mr-2 inline text-[#ff5656]" /> VIDEO
              FEED
            </span>
            <button
              onClick={() =>
                alert(
                  'Upload workflow will be enabled after R2 upload API and authentication are configured.'
                )
              }
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-black hover:bg-red-100"
            >
              <UploadCloud size={16} /> Upload
            </button>
          </div>
          <button
            className="rounded-lg border border-white/10 p-2 sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 px-4 py-3 sm:hidden">
            <button
              onClick={() =>
                alert('Upload will be enabled after the backend is configured.')
              }
              className="w-full rounded-xl bg-white px-4 py-3 font-bold text-black"
            >
              Upload a video
            </button>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-0 pb-20 pt-0 sm:px-6 sm:pb-16 sm:pt-8">
        <section className="relative hidden sm:block" aria-label="Desktop video feed">
          <div className="relative h-[72vh] min-h-[540px] overflow-hidden rounded-3xl bg-[#17191d]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#4b515a] via-[#252a31] to-[#090a0d]" />
            <div className="absolute inset-0 opacity-50" style={{backgroundImage:"linear-gradient(180deg,rgba(0,0,0,.25),transparent 28%,transparent 65%,rgba(0,0,0,.8)), repeating-linear-gradient(90deg,transparent 0 13%,rgba(255,255,255,.035) 13.5% 14%,transparent 14.5% 28%), linear-gradient(135deg,#4b5059,#252a31 42%,#101217)"}} />
            <nav aria-label="Video sections" className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-5 border-b border-white/10 bg-[#08090c]/70 px-3 pb-3 pt-4 text-sm font-bold backdrop-blur-sm">              <a href="#feed" className="border-b-2 border-[#ff5555] pb-1 text-white no-underline">Videos 🎬</a>
              <a href="https://itworldlive.stream/" className="text-white/75 no-underline">Live 🔴</a>
              <a href="#social" className="text-white/75 no-underline">Social 🪩</a>
            </nav>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-white/15 bg-black/20 text-2xl font-black text-white/75 shadow-xl">IW</div>
              <p className="mt-3 text-[10px] font-bold tracking-[.25em] text-white/60">IT WORLD COMMUNITY</p>
              <p className="mt-2 text-xs text-white/50">R2 video playback will appear after media is connected</p>
            </div>
            <div className="absolute bottom-5 right-3 z-10 flex flex-col items-center gap-5 text-white">
              <button className="flex flex-col items-center gap-1" aria-label="Like video" onClick={() => alert('Likes will be saved after sign-in and backend setup.')}><Heart size={30} fill="white" /><span className="text-[11px]">Like</span></button>
              <button className="flex flex-col items-center gap-1" aria-label="Comments" onClick={() => alert('Comments will be connected to the chat service.')}><MessageCircle size={28} fill="white" stroke="#111318" /><span className="text-[11px]">Comments</span></button>
              <a className="flex flex-col items-center gap-1 text-white no-underline" href="https://wa.me/" aria-label="Order via WhatsApp"><span className="grid h-8 w-8 place-items-center rounded-full bg-green-600"><MessageCircle size={20}/></span><span className="text-[10px] text-center">Order via<br/>WhatsApp</span></a>
              <button className="flex flex-col items-center gap-1" aria-label="More video actions" onClick={() => setMoreOpen(!moreOpen)}><span className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-2xl">•••</span><span className="text-[11px]">More</span></button>
              {moreOpen && <div className="absolute bottom-0 right-12 flex w-36 flex-col rounded-xl border border-white/15 bg-[#17191f] p-2 text-xs shadow-xl">{['Share','Download','Copy link','Report'].map(item=><button key={item} className="rounded-lg px-3 py-2 text-left hover:bg-white/10" onClick={()=>{if(item==='Copy link'&&navigator.clipboard) navigator.clipboard.writeText(window.location.href); else alert(item+' will be enabled with the video backend.');setMoreOpen(false)}}>{item}</button>)}</div>}
            </div>
            <div className="absolute bottom-5 left-4 right-16 z-10 text-white">
              <p className="font-extrabold">@itworldcommunity</p>
              <p className="mt-2 text-sm">Jersey drops, custom designs and match-day stories.</p>
              <p className="mt-2 text-xs text-white/75">#ITWORLD #Jersey #CustomDesign</p>
            </div>
          </div>
        </section>
        <section className="relative sm:hidden h-[calc(100dvh-12.5rem)] min-h-[430px] max-h-[760px] overflow-y-auto snap-y snap-mandatory overscroll-contain" aria-label="Swipe up for next video and down for previous video">
          <div className="pointer-events-none sticky top-2 z-20 mx-auto -mb-8 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 text-[11px] font-bold text-white/90 backdrop-blur">
            <span className="text-[#ff7777]">{String(activeVideoIndex + 1).padStart(2, '0')} / {String(clips.length).padStart(2, '0')}</span>
            <span className="text-white/70">↑ Next · ↓ Previous</span>
          </div>
          {clips.map((clip, index) => (
            <article key={clip.id} className="relative h-[calc(100dvh-12.5rem)] min-h-[430px] max-h-[760px] snap-start snap-always overflow-hidden bg-[#08090c] text-white">
              <video ref={(el) => { if (el) videoRefs.current[index] = el; }} data-primary={clip.src} data-fallbacks={JSON.stringify(clip.fallbacks)} data-fallback-index="0" data-loaded={index === 0 ? "true" : undefined} src={index === 0 ? clip.src : undefined} className="absolute inset-0 h-full w-full object-contain" controls={false} playsInline loop muted preload={index === 0 ? "auto" : "none"} onError={(e) => { const video = e.currentTarget; const candidates = JSON.parse(video.dataset.fallbacks || '[]') as string[]; const next = Number(video.dataset.fallbackIndex || 0); if (next < candidates.length) { video.dataset.fallbackIndex = String(next + 1); video.load(); video.src = candidates[next]; } }} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
              <div className="absolute inset-0 opacity-40" style={{backgroundImage:"linear-gradient(180deg,rgba(0,0,0,.28),transparent 30%,transparent 58%,rgba(0,0,0,.86)),repeating-linear-gradient(90deg,transparent 0 13%,rgba(255,255,255,.035) 13.5% 14%,transparent 14.5% 28%)"}} />
              <nav aria-label="Video sections" className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-4 border-b border-white/10 bg-[#08090c]/65 px-2 pb-3 pt-4 text-xs font-bold backdrop-blur-sm">
                <a href="#feed" className="border-b-2 border-[#ff5555] pb-1 text-white no-underline">Videos 🎬</a>
                <a href="https://itworldlive.stream/" className="text-white/75 no-underline">Live 🔴</a>
                <a href="#social" className="text-white/75 no-underline">Social 🪩</a>
              </nav>

              <div className="absolute bottom-5 right-3 z-10 flex flex-col items-center gap-4 text-white">
                <button className="flex flex-col items-center gap-1" aria-label="Like video" aria-pressed={likedVideos.has(clip.id)} onClick={() => toggleLike(clip.id)}><Heart size={29} fill={likedVideos.has(clip.id) ? '#ff5555' : 'white'} stroke={likedVideos.has(clip.id) ? '#ff5555' : 'white'} /><span className="text-[10px]">{likedVideos.has(clip.id) ? 'Liked' : 'Like'} · {likedVideos.has(clip.id) ? 1 : 0}</span></button>
                <button className="flex flex-col items-center gap-1" aria-label="Comments" onClick={() => { setCommentsFor(clip.id); setCommentDraft(''); }}><MessageCircle size={27} fill="white" stroke="#111318" /><span className="text-[10px]">Comments · {(localComments[clip.id] || []).length}</span></button>
                <button className="flex flex-col items-center gap-1" aria-label="Share video" onClick={() => void shareClip(clip)}><Share2 size={25} /><span className="text-[10px]">Share</span></button>
                <a className="flex flex-col items-center gap-1 text-white no-underline" href="https://wa.me/" aria-label="Order via WhatsApp"><span className="grid h-8 w-8 place-items-center rounded-full bg-green-600"><MessageCircle size={20}/></span><span className="text-[10px] text-center">Order via<br/>WhatsApp</span></a>
                <button className="flex flex-col items-center gap-1" aria-label="More video actions" onClick={() => setMoreOpen(!moreOpen)}><span className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-2xl">•••</span><span className="text-[10px]">More</span></button>
                {moreOpen && <div className="absolute bottom-0 right-12 flex w-36 flex-col rounded-xl border border-white/15 bg-[#17191f] p-2 text-xs shadow-xl">{['Share','Download','Copy link','Report'].map(item=><button key={item} className="rounded-lg px-3 py-2 text-left hover:bg-white/10" onClick={()=>{if(item==='Copy link'&&navigator.clipboard) navigator.clipboard.writeText(window.location.href); else alert(item+' will be enabled with the video backend.');setMoreOpen(false)}}>{item}</button>)}</div>}
              </div>
              {commentsFor === clip.id && <div className="absolute inset-x-3 bottom-20 z-30 rounded-2xl border border-white/15 bg-[#111319]/95 p-3 shadow-2xl backdrop-blur-xl" role="dialog" aria-label="Video comments"><div className="mb-3 flex items-center justify-between"><span className="font-extrabold">Comments · {(localComments[clip.id] || []).length}</span><button aria-label="Close comments" onClick={() => setCommentsFor(null)} className="rounded-lg p-1 text-white/70"><X size={18}/></button></div><div className="max-h-32 space-y-2 overflow-y-auto text-sm">{(localComments[clip.id] || []).length === 0 ? <p className="text-white/50">Be the first to comment.</p> : (localComments[clip.id] || []).map((comment, commentIndex) => <p key={commentIndex} className="rounded-lg bg-white/[.06] px-3 py-2">{comment}</p>)}</div><form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); const value = commentDraft.trim(); if (!value) return; setLocalComments(previous => ({ ...previous, [clip.id]: [...(previous[clip.id] || []), value] })); setCommentDraft(''); }}><input value={commentDraft} onChange={e => setCommentDraft(e.target.value)} placeholder="Write a comment…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"/><button type="submit" className="rounded-xl bg-[#f04444] px-3 py-2 text-sm font-bold">Post</button></form><p className="mt-2 text-[10px] text-white/40">Preview only — comments are stored on this device/session.</p></div>}
              <div className="absolute bottom-5 left-4 right-16 z-10 text-white">
                <p className="font-extrabold">@itworldcommunity</p>
                <p className="mt-2 text-sm">{clip.title}</p>
                <p className="mt-2 text-xs text-white/75">#{clip.category.replace(/\s+/g, '')} #ITWORLD</p>
                <p className="mt-2 text-[10px] text-white/55">Swipe ↑ next · Swipe ↓ previous</p>
              </div>
            </article>
          ))}
        </section>
        <section className="relative hidden overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#231013] via-[#151116] to-[#10131c] p-6 sm:block sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.2fr_.8fr] md:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-[11px] font-black tracking-[.16em] text-red-200">
                <span className="h-2 w-2 rounded-full bg-red-400" /> JERSEY
                VIDEO COMMUNITY
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
                Your game.
                <br />
                <span className="text-[#ff5b5b]">Your jersey.</span>
                <br />
                Your story.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-white/60 sm:text-base">
                A dedicated video home for jersey drops, custom designs,
                match-day inspiration and IT WORLD JERSEY stories.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#feed"
                  className="rounded-full bg-[#f04444] px-5 py-3 text-sm font-extrabold text-white no-underline hover:bg-[#ff5c5c]"
                >
                  Explore videos{' '}
                  <Play className="ml-2 inline" size={15} fill="white" />
                </a>
                <button
                  onClick={() =>
                    alert(
                      'The upload screen will be connected after authentication and the R2 upload endpoint are implemented.'
                    )
                  }
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/5"
                >
                  <UploadCloud className="mr-2 inline" size={16} /> Creator
                  tools
                </button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-xs">
              <div className="relative aspect-[9/13] overflow-hidden rounded-[2rem] border border-white/15 bg-[#0b0c10] p-3 shadow-2xl shadow-black/50">
                <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-b from-[#343844] via-[#171a22] to-[#08090c]" />
                <div className="absolute inset-x-8 top-10 flex items-center justify-between text-[10px] font-black tracking-widest text-white/70">
                  <span>IT WORLD</span>
                  <span className="rounded-full bg-red-500 px-2 py-1 text-white">
                    LIVE
                  </span>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="grid h-24 w-24 place-items-center rounded-3xl border border-white/15 bg-white/[.06]">
                    <Play size={42} fill="#ff5555" stroke="#ff5555" />
                  </div>
                  <span className="mt-5 text-xs font-black tracking-[.22em] text-white/70">
                    VIDEO FEED
                  </span>
                </div>
                <div className="absolute inset-x-7 bottom-9">
                  <div className="h-1 w-12 rounded-full bg-[#ff5555]" />
                  <p className="mt-3 text-sm font-extrabold">
                    Fresh drops. Real stories.
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Made for jersey lovers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="feed" className="hidden pt-10 sm:block">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black tracking-[.22em] text-[#ff6262]">
                THE FEED
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Find your next favorite
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Preview cards only — live R2 videos are not connected yet.
              </p>
            </div>
            <div className="flex gap-2">
              {['For you', 'New arrivals', 'Design ideas'].map(t => (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={
                    'rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 ' +
                    (active === t
                      ? 'bg-white text-black'
                      : 'border border-white/10 text-white/60 hover:text-white')
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered
              .filter(c => active === 'For you' || c.category === active)
              .map((clip, i) => (
                <article
                  key={clip.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111319]"
                >
                  <div
                    className={
                      'relative flex aspect-[4/5] items-center justify-center overflow-hidden ' +
                      (clip.color === 'coral'
                        ? 'bg-gradient-to-br from-[#3b1117] via-[#231018] to-[#11131b]'
                        : clip.color === 'blue'
                          ? 'bg-gradient-to-br from-[#10283a] via-[#151a2b] to-[#0b0d13]'
                          : 'bg-gradient-to-br from-[#403016] via-[#211b17] to-[#0b0d13]')
                    }
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 30% 20%, white 0, transparent 34%), linear-gradient(135deg, transparent 40%, rgba(255,255,255,.1) 40.5%, transparent 41%)',
                      }}
                    />
                    <div className="relative grid h-28 w-28 place-items-center rounded-[2rem] border border-white/15 bg-black/20 text-3xl font-black tracking-tight text-white/80 shadow-xl backdrop-blur-sm">
                      {clip.initials}
                    </div>
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
                      {clip.category}
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-md bg-black/50 px-2 py-1 text-[11px] font-bold">
                      {clip.duration}
                    </span>
                    <span className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-white text-black transition group-hover:scale-110">
                      <Play size={17} fill="currentColor" />
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-extrabold">{clip.title}</h3>
                    <div className="mt-3 flex items-center justify-between text-xs text-white/45">
                      <span>@itworldjersey · preview</span>
                      <span className="flex gap-3">                        <Heart size={15} />
                        <MessageCircle size={15} />
                        <Share2 size={15} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-white/10 p-10 text-center text-white/50">
              No preview clips match that search.
            </div>
          )}
        </section>
        <section id="social" className="mt-10 rounded-2xl border border-white/10 bg-white/[.03] p-5">
          <p className="text-[11px] font-black tracking-[.22em] text-[#ff6262]">SOCIAL</p>
          <h2 className="mt-2 text-xl font-black">Social video sources</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">This area is reserved for videos from approved third-party APIs. No external provider is connected in this preview yet; provider access and API terms will be configured before enabling imports.</p>
        </section>
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <ShieldCheck className="text-[#ff6464]" size={22} />
            <h3 className="mt-3 font-extrabold">Built for IT WORLD</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Independent branding and a separate project foundation.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <UploadCloud className="text-[#ff6464]" size={22} />
            <h3 className="mt-3 font-extrabold">R2-ready structure</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              The new bucket exists; media delivery and uploads still need
              wiring.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <CircleHelp className="text-[#ff6464]" size={22} />
            <h3 className="mt-3 font-extrabold">Login comes next</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Email first; social and phone sign-in need provider setup.
            </p>
          </div>
        </section>
      </main>
      <nav aria-label="App navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#08090c]/95 px-2 py-2 backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 text-center text-[10px] font-bold">
          <a href="https://itworldjersey.store/" className="rounded-xl px-1 py-2 text-white/70 no-underline"><span className="block text-lg">⌂</span>Home</a>
          <a href="https://itworldjersey.store/shop" className="rounded-xl px-1 py-2 text-white/70 no-underline"><span className="block text-lg">▦</span>Shop</a>
          <a href="https://itworldjersey.store/custom-design.html" className="rounded-xl px-1 py-2 text-white/70 no-underline"><span className="block text-lg">＋</span>Create</a>
          <a href="https://messenger.profile.itworldlive.stream" className="rounded-xl px-1 py-2 text-white/70 no-underline"><span className="block text-lg">✉</span>Inbox</a>
          <a href="https://profile.itworldlive.stream" className="rounded-xl px-1 py-2 text-white/70 no-underline"><span className="block text-lg">◉</span>Profile</a>
        </div>
      </nav>
      <footer className="border-t border-white/10 pb-16 sm:pb-0">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-black tracking-widest text-white/70">
            IT WORLD LIVE
          </span>
          <span>
            Preview build · Existing DNS and video bucket left unchanged
          </span>
          <span>itworldlive.stream</span>
        </div>
      </footer>
    </div>
  );
}
