import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, MessageCircle, PlusCircle, User, Store, Gift, CalendarDays, X, Phone, CreditCard, Truck, Clock3, CheckCircle2, Upload, Bell, Navigation, CalendarPlus, Search, Share2, QrCode, Wallet, Loader2 } from 'lucide-react';

const APP_NAME = 'Naborly';
const DEFAULT_REFERRAL = 'NABOR-2026';
const SUPABASE_URL = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : '';
const SUPABASE_ANON_KEY = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : '';
const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabase ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const MOCK_EVENTS = [
  { id: 'e0', title: 'Kingston Night Market', loc: 'Kingston', date: 'Tonight 7:00 PM', host: 'City Events', whatsapp: '18765552000', desc: 'Food, music, shopping, and family fun.', price: 'JMD 1500', featured: true },
  { id: 'e1', title: 'Community Food Drive', loc: 'Kingston', date: 'Sat 2:00 PM', host: 'Nabor Volunteers', whatsapp: '18765552001', desc: 'Free groceries and family support.', price: 'Free', featured: false },
];
const MOCK_POSTS = [
  { id: 'p1', title: 'Fresh Fruit Bags', type: 'Food', price: 'JMD $700', loc: 'Kingston • Near St. Bess Pharmacy', parish: 'Kingston', qtyTotal: 10, qtyLeft: 8, desc: 'Fresh banana, orange, pineapple, and mango bags available for same-day pickup.', vendor: 'Marcia Produce', whatsapp: '18765551001', free: false, tracking: 'Ready for pickup', highlight: 'Pickup today', imageUrl: '' },
  { id: 'p2', title: 'Restaurant Meal Donations', type: 'Free Support', price: 'Free', loc: 'Kingston • Half Way Tree', parish: 'Kingston', qtyTotal: 20, qtyLeft: 12, desc: 'Prepared meals available while supplies last. First come, first served.', vendor: 'Island Kitchen', whatsapp: '18765551002', free: true, tracking: 'On the way', highlight: 'Donation pickup', imageUrl: '' },
];

const MARKETS = { JA: 'Welcome to Naborly JA', UK: 'Welcome to Naborly UK', BB: 'Welcome to Naborly Barbados', LA: 'Welcome to Naborly Latin America', AF: 'Welcome to Naborly Africa', WW: 'Welcome to Naborly Worldwide' };
const CURRENCY_MAP = { JA: 'JMD', UK: 'GBP', BB: 'BBD', LA: 'USD', AF: 'USD', WW: 'USD' };
const PAYMENT_OPTIONS = {
  JA: ['Debit/Credit Card', 'Lynk Wallet', 'NCB Pay', 'WiPay', 'Cash on Pickup'],
  UK: ['Debit/Credit Card', 'Apple Pay', 'Google Pay', 'PayPal', 'Cash on Pickup'],
  BB: ['Debit/Credit Card', 'WiPay', 'Bank Transfer', 'Cash on Pickup'],
  LA: ['Debit/Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Pickup'],
  AF: ['Debit/Credit Card', 'Mobile Money', 'Bank Transfer', 'Cash on Pickup'],
  WW: ['Debit/Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Pickup'],
};
const PARISH_MAP = {
  JA: ['Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon', 'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James', 'Trelawny', 'St. Ann', 'St. Mary', 'Portland', 'St. Thomas'],
  UK: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Liverpool'],
  BB: ['Christ Church', 'St. Michael', 'St. James', 'St. Philip'],
  LA: ['Santo Domingo', 'San Juan', 'Port-au-Prince', 'Kingston DR'],
  AF: ['Lagos', 'Accra', 'Nairobi', 'Johannesburg'],
  WW: ['Global'],
};
const TRACKING_STEPS = ['Reserved', 'Confirmed', 'On the way', 'Ready for pickup', 'Delivered'];

function getPaymentOptions(market) { return PAYMENT_OPTIONS[market] || PAYMENT_OPTIONS.WW; }
function getCurrency(market) { return CURRENCY_MAP[market] || 'USD'; }
function safeWhatsapp(number, title, area = '') {
  const clean = String(number || '').replace(/\D/g, '');
  const areaText = area && area !== 'All' ? ` (${area})` : '';
  const text = encodeURIComponent(`Hi, I saw "${title}" on ${APP_NAME}${areaText}. Is it still available?`);
  return `https://wa.me/${clean}?text=${text}`;
}
function shareWhatsApp(text) { return `https://wa.me/?text=${encodeURIComponent(text)}`; }
function label(language, en, patwa) { return language === 'patwa' ? patwa : en; }
function trackingIndex(status) { return Math.max(0, TRACKING_STEPS.indexOf(status)); }
function statusIcon(status) { if (status === 'Delivered') return <CheckCircle2 className='w-4 h-4' />; if (status === 'On the way') return <Truck className='w-4 h-4' />; return <Clock3 className='w-4 h-4' />; }
function wait(ms = 250) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function getCurrentUser() { if (!supabase) return null; const { data } = await supabase.auth.getUser(); return data?.user ?? null; }

const mockApi = {
  async getPosts() { await wait(); return [...MOCK_POSTS]; },
  async getEvents() { await wait(); return [...MOCK_EVENTS]; },
  async getFavorites() { await wait(); return ['p1']; },
  async getSavedEvents() { await wait(); return ['e1']; },
  async toggleFavorite(currentIds, id) { await wait(); return currentIds.includes(id) ? currentIds.filter((x) => x !== id) : [...currentIds, id]; },
  async toggleSavedEvent(currentIds, id) { await wait(); return currentIds.includes(id) ? currentIds.filter((x) => x !== id) : [...currentIds, id]; },
};

const supabaseApi = {
  async getPosts() {
    if (!supabase) return [...MOCK_POSTS];
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => ({
      id: row.id, title: row.title, type: row.type, price: row.price, loc: row.loc, parish: row.parish,
      qtyTotal: row.qty_total ?? 0, qtyLeft: row.qty_left ?? 0, desc: row.description, vendor: row.vendor,
      whatsapp: row.whatsapp, free: Boolean(row.free), tracking: row.tracking || 'Reserved',
      highlight: row.highlight || '', imageUrl: row.image_url || '',
    }));
  },
  async getEvents() {
    if (!supabase) return [...MOCK_EVENTS];
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => ({
      id: row.id, title: row.title, loc: row.loc, date: row.date_text, host: row.host,
      whatsapp: row.whatsapp, desc: row.description, price: row.price, featured: Boolean(row.featured),
    }));
  },
  async getFavorites() {
    if (!supabase) return ['p1'];
    const user = await getCurrentUser();
    if (!user) return [];
    const { data, error } = await supabase.from('favorites').select('item_id').eq('user_id', user.id).eq('item_type', 'post');
    if (error) throw error;
    return (data || []).map((row) => row.item_id);
  },
  async getSavedEvents() {
    if (!supabase) return ['e1'];
    const user = await getCurrentUser();
    if (!user) return [];
    const { data, error } = await supabase.from('favorites').select('item_id').eq('user_id', user.id).eq('item_type', 'event');
    if (error) throw error;
    return (data || []).map((row) => row.item_id);
  },
  async toggleFavorite(currentIds, id) {
    if (!supabase) return currentIds.includes(id) ? currentIds.filter((x) => x !== id) : [...currentIds, id];
    const user = await getCurrentUser();
    if (!user) return currentIds;
    if (currentIds.includes(id)) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_type', 'post').eq('item_id', id);
      if (error) throw error;
      return currentIds.filter((x) => x !== id);
    }
    const { error } = await supabase.from('favorites').insert({ user_id: user.id, item_type: 'post', item_id: id });
    if (error) throw error;
    return [...currentIds, id];
  },
  async toggleSavedEvent(currentIds, id) {
    if (!supabase) return currentIds.includes(id) ? currentIds.filter((x) => x !== id) : [...currentIds, id];
    const user = await getCurrentUser();
    if (!user) return currentIds;
    if (currentIds.includes(id)) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_type', 'event').eq('item_id', id);
      if (error) throw error;
      return currentIds.filter((x) => x !== id);
    }
    const { error } = await supabase.from('favorites').insert({ user_id: user.id, item_type: 'event', item_id: id });
    if (error) throw error;
    return [...currentIds, id];
  },
};

function useAppData() {
  const api = hasSupabase ? supabaseApi : mockApi;
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [postsData, eventsData, favoritesData, savedEventsData] = await Promise.all([api.getPosts(), api.getEvents(), api.getFavorites(), api.getSavedEvents()]);
      setPosts(postsData); setEvents(eventsData); setFavoriteIds(favoritesData); setSavedEventIds(savedEventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app data.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggleFavorite = useCallback(async (id) => {
    try { setFavoriteIds(await api.toggleFavorite(favoriteIds, id)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not update favorites.'); }
  }, [api, favoriteIds]);

  const toggleSavedEvent = useCallback(async (id) => {
    try { setSavedEventIds(await api.toggleSavedEvent(savedEventIds, id)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not update saved events.'); }
  }, [api, savedEventIds]);

  return { posts, events, favoriteIds, savedEventIds, loading, error, toggleFavorite, toggleSavedEvent, isLive: hasSupabase };
}

function CardDetailModal({ card, onClose, onReserve, market }) {
  if (!card) return null;
  return (
    <AnimatePresence>
      <motion.div className='fixed inset-0 z-50 bg-black/55 p-4 md:p-8 flex items-end md:items-center justify-center overflow-y-auto' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.98 }} className='w-full max-w-4xl rounded-[30px] bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col'>
          <div className='p-5 md:p-7 border-b flex items-start justify-between gap-4'>
            <div>
              <div className='inline-flex px-3 py-1 rounded-full bg-amber-100 text-xs font-bold'>{card.type}</div>
              <h3 className='text-2xl md:text-3xl font-black mt-3'>{card.title}</h3>
              <div className='mt-2 flex items-center gap-2 text-sm text-zinc-600'><MapPin className='w-4 h-4' />{card.loc}</div>
            </div>
            <button onClick={onClose} className='rounded-xl border p-2 hover:bg-zinc-50'><X className='w-5 h-5' /></button>
          </div>
          <div className='grid lg:grid-cols-[1.1fr_.9fr] overflow-y-auto'>
            <div className='p-5 md:p-7 border-b lg:border-b-0 lg:border-r'>
              <div className='text-lg font-bold'>{card.price}</div>
              <div className='mt-2 text-green-700 font-semibold'>Quantity left: {card.qtyLeft} of {card.qtyTotal}</div>
              <p className='mt-4 text-zinc-700 leading-7'>{card.desc}</p>
            </div>
            <div className='p-5 md:p-7 bg-zinc-50'>
              <h4 className='text-xl font-black'>Reserve / Pay</h4>
              <div className='mt-2 text-xs text-zinc-500'>Secure checkout enabled • {getPaymentOptions(market).join(' / ')} • Currency: {getCurrency(market)}</div>
              <button onClick={() => onReserve(card)} className='mt-4 w-full rounded-2xl bg-green-700 text-white px-4 py-3 font-bold hover:bg-green-800'>{card.free ? 'Reserve Free Item' : 'Secure Checkout'}</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SignupModal({ open, onClose, market }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [parish, setParish] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  if (!open) return null;

  const handleSignup = async () => {
    if (!supabase) { setMessage('Supabase not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live signup.'); return; }
    try {
      setSaving(true); setMessage('');
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, whatsapp, market, parish } } });
      if (error) throw error;
      const userId = data.user?.id;
      if (userId) await supabase.from('profiles').upsert({ id: userId, full_name: fullName, email, whatsapp, market, parish });
      setMessage('Account created. Check your email or sign in if confirmations are disabled.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className='fixed inset-0 z-50 bg-black/55 p-4 flex items-center justify-center overflow-y-auto' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className='w-full max-w-lg rounded-[30px] bg-white p-6 md:p-7 shadow-2xl max-h-[92vh] overflow-y-auto'>
          <div className='flex justify-between items-start gap-4'>
            <div><h3 className='text-2xl font-black'>Create Free Account</h3><p className='text-zinc-600 mt-2'>Join {APP_NAME} to post, favorite, reserve, track, and grow your naborhood.</p></div>
            <button onClick={onClose} className='rounded-xl border p-2 hover:bg-zinc-50'><X className='w-5 h-5' /></button>
          </div>
          <div className='mt-5 grid gap-3'>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className='w-full rounded-2xl border p-3' placeholder='Full name' />
            <input value={email} onChange={(e) => setEmail(e.target.value)} className='w-full rounded-2xl border p-3' placeholder='Email' />
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className='w-full rounded-2xl border p-3' placeholder='WhatsApp number' />
            <select value={parish} onChange={(e) => setParish(e.target.value)} className='w-full rounded-2xl border p-3'>
              <option value=''>Select your parish / location</option>
              {(PARISH_MAP[market] || []).map((p) => <option key={p}>{p}</option>)}
            </select>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full rounded-2xl border p-3' placeholder='Create password' />
            {message ? <div className='rounded-2xl border p-3 text-sm text-zinc-700'>{message}</div> : null}
            <button onClick={handleSignup} disabled={saving} className='w-full rounded-2xl bg-green-700 text-white py-3 font-bold hover:bg-green-800 disabled:opacity-60'>{saving ? 'Creating Account…' : 'Create Free Account'}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function KpiCard({ title, value }) {
  return <div className='bg-white rounded-[24px] p-5 border shadow-sm hover:shadow-md transition-shadow'><div className='text-2xl md:text-3xl font-black'>{value}</div><div className='text-sm text-zinc-600 mt-1'>{title}</div></div>;
}

export default function App() {
  const [market, setMarket] = useState('JA');
  const [language, setLanguage] = useState('en');
  const [tab, setTab] = useState('home');
  const [detailCard, setDetailCard] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [trackingView, setTrackingView] = useState(MOCK_POSTS[1]);
  const [mapMode, setMapMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertsOn, setAlertsOn] = useState(false);
  const [eventFilter, setEventFilter] = useState('All');
  const [selectedParish, setSelectedParish] = useState('All');
  const { posts, events, favoriteIds, savedEventIds, loading, error, toggleFavorite, toggleSavedEvent, isLive } = useAppData();

  const parishOptions = useMemo(() => ['All', ...(PARISH_MAP[market] || [])], [market]);
  const favoritePosts = useMemo(() => posts.filter((c) => favoriteIds.includes(c.id)), [posts, favoriteIds]);
  const supportPosts = useMemo(() => posts.filter((c) => c.free || c.type === 'Free Support'), [posts]);
  const visiblePosts = useMemo(() => posts.filter((c) => {
    const parishOk = selectedParish === 'All' || c.loc.toLowerCase().includes(selectedParish.toLowerCase()) || String(c.parish || '').toLowerCase().includes(selectedParish.toLowerCase());
    const q = searchTerm.toLowerCase().trim();
    const searchOk = !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
    return parishOk && searchOk;
  }), [posts, selectedParish, searchTerm]);
  const visibleEvents = useMemo(() => events.filter((ev) => {
    const parishOk = eventFilter === 'All' || ev.loc.toLowerCase().includes(eventFilter.toLowerCase());
    const q = searchTerm.toLowerCase().trim();
    const searchOk = !q || ev.title.toLowerCase().includes(q) || ev.desc.toLowerCase().includes(q);
    return parishOk && searchOk;
  }), [events, eventFilter, searchTerm]);

  const renderPostCard = (post) => (
    <motion.div key={post.id} layout className='bg-white rounded-[24px] p-5 border shadow-sm hover:shadow-lg transition-shadow'>
      <div className='flex items-start justify-between gap-3'>
        <span className='text-xs font-bold bg-amber-100 px-2.5 py-1 rounded-full'>{post.type}</span>
        <button onClick={() => toggleFavorite(post.id)} className='rounded-full p-1.5 hover:bg-zinc-100'><Heart className={`w-5 h-5 ${favoriteIds.includes(post.id) ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} /></button>
      </div>
      <h3 className='font-black text-xl mt-3'>{post.title}</h3>
      <div className='mt-2 text-sm flex gap-2 items-center text-zinc-600'><MapPin className='w-4 h-4' />{post.loc}</div>
      <div className='mt-3 font-bold'>{post.price}</div>
      <div className='text-green-700 text-sm font-semibold mt-1'>Quantity left: {post.qtyLeft} / {post.qtyTotal}</div>
      <div className='mt-4 flex gap-2 flex-wrap'>
        <a href={safeWhatsapp(post.whatsapp, post.title, selectedParish)} target='_blank' rel='noreferrer' className='px-3 py-2 rounded-xl border flex gap-2 items-center hover:bg-zinc-50'><MessageCircle className='w-4 h-4' />WhatsApp</a>
        <button onClick={() => setDetailCard(post)} className='px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800'>{post.type === 'Talent' ? 'Book Talent' : 'Learn More'}</button>
      </div>
    </motion.div>
  );

  const navItems = [['home','Home'],['marketplace','Market'],['support','Support'],['events','Events'],['post','Post'],['partners','Ads'],['saved','Saved'],['account','Account']];

  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 text-zinc-900'>
      <header className='sticky top-0 z-30 bg-white/90 backdrop-blur border-b px-4 md:px-8 py-4'>
        <div className='max-w-[1400px] mx-auto flex flex-wrap gap-4 items-start justify-between'>
          <div>
            <div className='text-3xl font-black tracking-tight'>{APP_NAME}</div>
            <div className='text-green-700 font-semibold flex items-center gap-2'><span>{MARKETS[market]}</span><motion.span animate={{ rotate: [0,15,0,-15,0] }} transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 2 }} className='inline-block origin-bottom'>👋</motion.span></div>
            <div className='text-sm text-zinc-500'>{label(language, 'Neighbors helping neighbors, selling to neighbors.', 'Nabor a help nabor, a sell to nabor too.')}</div>
            <div className='text-xs text-zinc-400 mt-1'>{isLive ? 'Live Supabase mode' : 'Preview mode'}</div>
          </div>
          <div className='flex gap-2 items-center flex-wrap'>
            <details className='relative'><summary className='list-none cursor-pointer rounded-xl border bg-white px-3 py-2 text-sm'>▾</summary><div className='absolute right-0 mt-2 w-44 rounded-2xl border bg-white shadow-lg p-2 z-40'><button onClick={() => setLanguage('en')} className='w-full text-left rounded-xl px-3 py-2 hover:bg-zinc-50'>English</button><button onClick={() => setLanguage('patwa')} className='w-full text-left rounded-xl px-3 py-2 hover:bg-zinc-50'>Patois (Patwa)</button></div></details>
            <select value={market} onChange={(e) => setMarket(e.target.value)} className='border rounded-xl px-3 py-2 bg-white'><option value='JA'>Jamaica</option><option value='UK'>UK</option><option value='BB'>Barbados</option><option value='LA'>Latin America</option><option value='AF'>Africa</option><option value='WW'>Worldwide</option></select>
            <button onClick={() => { setTab('account'); setShowSignup(true); }} className='px-4 py-2 rounded-xl border hover:bg-zinc-100'>Sign In</button>
            <button onClick={() => { setTab('account'); setShowSignup(true); }} className='px-4 py-2 rounded-xl bg-green-700 text-white hover:bg-green-800'>Create Free Account</button>
          </div>
        </div>
      </header>

      <section className='px-4 md:px-8 py-8 md:py-10'>
        <div className='max-w-[1400px] mx-auto rounded-[30px] overflow-hidden bg-gradient-to-r from-green-700 via-yellow-500 to-black text-white shadow-lg'>
          <div className='px-6 md:px-10 py-10 md:py-12'>
            <h1 className='text-3xl md:text-5xl font-black max-w-4xl leading-tight'>Neighborhood marketplace, food support, local talent, donations, events, and community connection.</h1>
            <p className='mt-3 max-w-2xl text-white/90 text-base md:text-lg'>{label(language, 'Buy, sell, donate, share events and help neighbors in one ecosystem.', 'Buy, sell, donate, share event an help yuh nabor dem inna one ecosystem.')}</p>
          </div>
        </div>
      </section>

      <nav className='px-4 md:px-8 pb-2'><div className='max-w-[1400px] mx-auto flex gap-2 flex-wrap'>{navItems.map(([t, txt]) => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full border text-sm ${tab === t ? 'bg-black text-white border-black' : 'bg-white hover:bg-zinc-50'}`}>{txt}</button>)}</div></nav>

      <main className='p-4 md:p-8 max-w-[1400px] mx-auto overflow-x-hidden'>
        <div className='mb-5 flex flex-wrap gap-3 items-center'>
          <select value={selectedParish} onChange={(e) => setSelectedParish(e.target.value)} className='border rounded-2xl px-4 py-3 bg-white'>{parishOptions.map((p) => <option key={p}>{p}</option>)}</select>
          <div className='relative min-w-[260px] flex-1 max-w-xl'><Search className='w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400' /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search food, services, donations, talent...' className='border rounded-2xl pl-11 pr-4 py-3 bg-white w-full' /></div>
          <button onClick={() => setMapMode(!mapMode)} className='border rounded-2xl px-4 py-3 bg-white flex items-center gap-2'><Navigation className='w-4 h-4' />{mapMode ? 'List View' : 'Map View'}</button>
          <button onClick={() => setAlertsOn(!alertsOn)} className={`border rounded-2xl px-4 py-3 flex items-center gap-2 ${alertsOn ? 'bg-green-700 text-white' : 'bg-white'}`}><Bell className='w-4 h-4' />{alertsOn ? 'Alerts On' : 'Alerts Off'}</button>
        </div>

        {error ? <div className='mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>{error}</div> : null}
        {loading ? <div className='rounded-[24px] border bg-white p-10 flex items-center justify-center gap-3 text-zinc-600'><Loader2 className='w-5 h-5 animate-spin' /><span>Loading app data…</span></div> : null}

        {!loading && tab === 'home' && <div className='space-y-7'><div className='grid grid-cols-2 xl:grid-cols-4 gap-4'><KpiCard title='Active Listings' value={posts.length} /><KpiCard title='Food Support' value={supportPosts.length} /><KpiCard title='Local Talent' value={posts.filter((p) => p.type === 'Talent').length} /><KpiCard title='Events Nearby' value={events.length} /></div><div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visiblePosts.map(renderPostCard)}</div></div>}
        {!loading && tab === 'marketplace' && <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visiblePosts.map(renderPostCard)}</div>}
        {!loading && tab === 'support' && <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{supportPosts.map(renderPostCard)}</div>}
        {!loading && tab === 'events' && <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visibleEvents.map((ev) => <div key={ev.id} className='bg-white rounded-[24px] p-5 border shadow-sm'><div className='flex items-start justify-between gap-3'><span className='text-xs font-bold bg-amber-100 px-2.5 py-1 rounded-full'>{ev.featured ? 'Featured Event' : 'Event'}</span><button onClick={() => toggleSavedEvent(ev.id)} className='rounded-full p-1 hover:bg-zinc-100'><Heart className={`w-5 h-5 ${savedEventIds.includes(ev.id) ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} /></button></div><h3 className='font-black text-xl mt-3'>{ev.title}</h3><div className='mt-2 text-sm text-zinc-600 flex items-center gap-2'><MapPin className='w-4 h-4' />{ev.loc}</div><div className='mt-1 text-sm text-zinc-600'>{ev.date}</div><div className='mt-3 text-sm'>{ev.desc}</div></div>)}</div>}
        {!loading && tab === 'saved' && <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{favoritePosts.length ? favoritePosts.map(renderPostCard) : <p>No favorites yet.</p>}</div>}
        {!loading && tab === 'account' && <div className='grid xl:grid-cols-[1fr_.9fr] gap-4 items-start'><div className='bg-white p-6 rounded-[28px] border shadow-sm'><User className='mb-2' /><h2 className='text-3xl font-black'>Account</h2><div className='mt-5 grid gap-3'><button onClick={() => setShowSignup(true)} className='rounded-2xl bg-green-700 text-white px-4 py-3 font-semibold hover:bg-green-800'>Open Signup Form</button></div></div><div className='bg-white p-6 rounded-[28px] border shadow-sm'><CalendarDays className='mb-2' /><h2 className='text-2xl font-black'>Tracking</h2><div className='mt-5 rounded-2xl border bg-amber-50 p-4'><div className='text-xs text-zinc-500'>Current item</div><div className='font-black text-lg mt-1'>{trackingView.title}</div></div></div></div>}
      </main>

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} market={market} />
      <CardDetailModal card={detailCard} onClose={() => setDetailCard(null)} onReserve={(card) => { setTrackingView(card); setTab('account'); setDetailCard(null); }} market={market} />
    </div>
  );
}
