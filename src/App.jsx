import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MapPin,
  MessageCircle,
  PlusCircle,
  User,
  Store,
  Gift,
  CalendarDays,
  X,
  Phone,
  CreditCard,
  Truck,
  Clock3,
  CheckCircle2,
  Upload,
  Bell,
  Navigation,
  CalendarPlus,
  Search,
  Share2,
  QrCode,
  Wallet,
  Loader2,
} from 'lucide-react';

const APP_NAME = 'Naborly';
const DEFAULT_REFERRAL = 'NABOR-2026';
const SUPABASE_URL = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : '';
const SUPABASE_ANON_KEY = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : '';
const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabase ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const MOCK_EVENTS = [
  { id: 'e0', title: 'Kingston Night Market', loc: 'Kingston', date: 'Tonight 7:00 PM', host: 'City Events', whatsapp: '18765552000', desc: 'Food, music, shopping, and family fun.', price: 'JMD 1500', featured: true },
  { id: 'e1', title: 'Community Food Drive', loc: 'Kingston', date: 'Sat 2:00 PM', host: 'Nabor Volunteers', whatsapp: '18765552001', desc: 'Free groceries and family support.', price: 'Free', featured: false },
  { id: 'e2', title: 'Vendor Pop-Up Market', loc: 'Montego Bay', date: 'Sun 11:00 AM', host: 'Island Makers', whatsapp: '18765552002', desc: 'Local vendors, food, music, gifts.', price: 'JMD 500', featured: true },
  { id: 'e3', title: 'Youth Football Clinic', loc: 'St. James', date: 'Fri 4:00 PM', host: 'Coach Devon', whatsapp: '18765552003', desc: 'Free youth sports training.', price: 'Free', featured: false },
];

const MOCK_POSTS = [
  { id: 'p1', title: 'Fresh Fruit Bags', type: 'Food', price: 'JMD $700', loc: 'Kingston • Near St. Bess Pharmacy', parish: 'Kingston', qtyTotal: 10, qtyLeft: 8, desc: 'Fresh banana, orange, pineapple, and mango bags available for same-day pickup.', vendor: 'Marcia Produce', whatsapp: '18765551001', free: false, tracking: 'Ready for pickup', highlight: 'Pickup today', imageUrl: '' },
  { id: 'p2', title: 'Restaurant Meal Donations', type: 'Free Support', price: 'Free', loc: 'Kingston • Half Way Tree', parish: 'Kingston', qtyTotal: 20, qtyLeft: 12, desc: 'Prepared meals available while supplies last. First come, first served.', vendor: 'Island Kitchen', whatsapp: '18765551002', free: true, tracking: 'On the way', highlight: 'Donation pickup', imageUrl: '' },
  { id: 'p3', title: 'Driver for Appointments', type: 'Talent', price: 'From JMD $2,000', loc: 'Montego Bay', parish: 'St. James', qtyTotal: 6, qtyLeft: 5, desc: 'Reliable local rides for appointments, school pickup, and errands.', vendor: 'Andre Rides', whatsapp: '18765551003', free: false, tracking: 'Reserved', highlight: '5 slots open', imageUrl: '' },
  { id: 'p4', title: 'Community Cleaning Help', type: 'Free Support', price: 'Free', loc: 'St. Andrew • Near Hope Gardens', parish: 'St. Andrew', qtyTotal: 4, qtyLeft: 2, desc: 'Volunteer cleaning help available for seniors and urgent situations.', vendor: 'Nabor Volunteers', whatsapp: '18765551004', free: true, tracking: 'Reserved', highlight: '2 slots left', imageUrl: '' },
];

const MARKETS = {
  JA: 'Welcome to Naborly JA',
  UK: 'Welcome to Naborly UK',
  BB: 'Welcome to Naborly Barbados',
  LA: 'Welcome to Naborly Latin America',
  AF: 'Welcome to Naborly Africa',
  WW: 'Welcome to Naborly Worldwide',
};

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
function statusIcon(status) {
  if (status === 'Delivered') return <CheckCircle2 className='w-4 h-4' />;
  if (status === 'On the way') return <Truck className='w-4 h-4' />;
  return <Clock3 className='w-4 h-4' />;
}
function wait(ms = 250) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

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
      id: row.id,
      title: row.title,
      type: row.type,
      price: row.price,
      loc: row.loc,
      parish: row.parish,
      qtyTotal: row.qty_total ?? 0,
      qtyLeft: row.qty_left ?? 0,
      desc: row.description,
      vendor: row.vendor,
      whatsapp: row.whatsapp,
      free: Boolean(row.free),
      tracking: row.tracking || 'Reserved',
      highlight: row.highlight || '',
      imageUrl: row.image_url || '',
    }));
  },
  async getEvents() {
    if (!supabase) return [...MOCK_EVENTS];
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      loc: row.loc,
      date: row.date_text,
      host: row.host,
      whatsapp: row.whatsapp,
      desc: row.description,
      price: row.price,
      featured: Boolean(row.featured),
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
    setLoading(true);
    setError('');
    try {
      const [postsData, eventsData, favoritesData, savedEventsData] = await Promise.all([
        api.getPosts(),
        api.getEvents(),
        api.getFavorites(),
        api.getSavedEvents(),
      ]);
      setPosts(postsData);
      setEvents(eventsData);
      setFavoriteIds(favoritesData);
      setSavedEventIds(savedEventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app data.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggleFavorite = useCallback(async (id) => {
    try {
      const next = await api.toggleFavorite(favoriteIds, id);
      setFavoriteIds(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update favorites.');
    }
  }, [api, favoriteIds]);

  const toggleSavedEvent = useCallback(async (id) => {
    try {
      const next = await api.toggleSavedEvent(savedEventIds, id);
      setSavedEventIds(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update saved events.');
    }
  }, [api, savedEventIds]);

  return { posts, events, favoriteIds, savedEventIds, loading, error, toggleFavorite, toggleSavedEvent, reload: loadAll, isLive: hasSupabase };
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
              <div className='mt-5 rounded-2xl bg-amber-50 p-4 border'>
                <div className='font-semibold'>Vendor / Host</div>
                <div className='text-zinc-700'>{card.vendor}</div>
                <div className='mt-3 flex items-center gap-2 text-sm text-zinc-600'>{statusIcon(card.tracking)}<span>{card.tracking}</span></div>
              </div>
              <div className='mt-5 flex flex-wrap gap-3'>
                <a href={safeWhatsapp(card.whatsapp, card.title)} target='_blank' rel='noreferrer' className='px-4 py-3 rounded-2xl border flex items-center gap-2 hover:bg-zinc-50'><MessageCircle className='w-4 h-4' />WhatsApp</a>
                <a href={`tel:${card.whatsapp}`} className='px-4 py-3 rounded-2xl border flex items-center gap-2 hover:bg-zinc-50'><Phone className='w-4 h-4' />Call</a>
              </div>
            </div>
            <div className='p-5 md:p-7 bg-zinc-50'>
              <h4 className='text-xl font-black'>Reserve / Pay</h4>
              <div className='mt-2 text-xs text-zinc-500'>Secure checkout enabled • {getPaymentOptions(market).join(' / ')} • Currency: {getCurrency(market)}</div>
              <p className='text-sm text-zinc-600 mt-2'>Use the intake below to reserve, book, or pay.</p>
              <div className='mt-4 space-y-3'>
                <input className='w-full rounded-2xl border p-3' placeholder='Full name' />
                <input className='w-full rounded-2xl border p-3' placeholder='WhatsApp number' />
                <textarea className='w-full rounded-2xl border p-3 min-h-[100px]' placeholder='Notes or request details' />
                {!card.free ? <div className='grid grid-cols-2 gap-2'>{getPaymentOptions(market).map((pay) => <button key={pay} className='rounded-2xl border p-3 flex items-center justify-center gap-2 bg-white text-sm'>{pay.includes('Card') && <CreditCard className='w-4 h-4' />}{(pay.includes('Wallet') || pay.includes('Pay') || pay.includes('WiPay')) && <Wallet className='w-4 h-4' />}{pay.includes('Pickup') && <Store className='w-4 h-4' />}<span>{pay}</span></button>)}</div> : <div className='rounded-2xl border border-dashed bg-white p-4 text-sm text-zinc-600'>This item is free. Payment is not needed. Continue to reserve or arrange pickup.</div>}
                <button onClick={() => onReserve(card)} className='w-full rounded-2xl bg-green-700 text-white px-4 py-3 font-bold hover:bg-green-800'>{card.type === 'Talent' ? 'Book Talent' : card.free ? 'Reserve Free Item' : 'Secure Checkout'}</button>
              </div>
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
    if (!supabase) {
      setMessage('Supabase not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live signup.');
      return;
    }
    try {
      setSaving(true);
      setMessage('');
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, whatsapp, market, parish } } });
      if (error) throw error;
      const userId = data.user?.id;
      if (userId) {
        await supabase.from('profiles').upsert({ id: userId, full_name: fullName, email, whatsapp, market, parish });
      }
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
            <div>
              <h3 className='text-2xl font-black'>Create Free Account</h3>
              <p className='text-zinc-600 mt-2'>Join {APP_NAME} to post, favorite, reserve, track, and grow your naborhood.</p>
            </div>
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
            <div className='rounded-2xl border border-dashed bg-amber-50 p-4 text-sm text-zinc-700'>Basic signup is free. Payment appears only for premium seller, ad, partner, or boosted marketplace upgrades.</div>
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

export default function OriginalNaborly() {
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
  const [eventToolMessage, setEventToolMessage] = useState('All event tools are active in preview mode.');
  const [eventToolState] = useState({ qr: true, vip: true, booths: true, countdown: true });
  const [selectedParish, setSelectedParish] = useState('All');
  const [adminMode, setAdminMode] = useState(true);
  const [showExamples, setShowExamples] = useState(true);

  const { posts, events, favoriteIds, savedEventIds, loading, error, toggleFavorite, toggleSavedEvent, isLive } = useAppData();

  const displayPosts = useMemo(() => {
    if (showExamples) return posts;
    return posts.filter((p) => !MOCK_POSTS.some((m) => m.title === p.title && m.vendor === p.vendor));
  }, [posts, showExamples]);

  const displayEvents = useMemo(() => {
    if (showExamples) return events;
    return events.filter((e) => !MOCK_EVENTS.some((m) => m.title === e.title && m.host === e.host));
  }, [events, showExamples]);

  const parishOptions = useMemo(() => ['All', ...(PARISH_MAP[market] || [])], [market]);
  const favoritePosts = useMemo(() => displayPosts.filter((c) => favoriteIds.includes(c.id)), [displayPosts, favoriteIds]);
  const supportPosts = useMemo(() => displayPosts.filter((c) => c.free || c.type === 'Free Support'), [displayPosts]);
  const visiblePosts = useMemo(() => displayPosts.filter((c) => {
    const parishOk = selectedParish === 'All' || c.loc.toLowerCase().includes(selectedParish.toLowerCase()) || String(c.parish || '').toLowerCase().includes(selectedParish.toLowerCase()) || c.vendor.toLowerCase().includes(selectedParish.toLowerCase());
    const q = searchTerm.toLowerCase().trim();
    const searchOk = !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
    return parishOk && searchOk;
  }), [displayPosts, selectedParish, searchTerm]);
  const visibleEvents = useMemo(() => displayEvents.filter((ev) => {
    const parishOk = eventFilter === 'All' || ev.loc.toLowerCase().includes(eventFilter.toLowerCase());
    const q = searchTerm.toLowerCase().trim();
    const searchOk = !q || ev.title.toLowerCase().includes(q) || ev.desc.toLowerCase().includes(q);
    return parishOk && searchOk;
  }), [displayEvents, eventFilter, searchTerm]);

  const renderPostCard = (post) => <motion.div key={post.id} layout className='bg-white rounded-[24px] p-5 border shadow-sm hover:shadow-lg transition-shadow'><div className='flex items-start justify-between gap-3'><span className='text-xs font-bold bg-amber-100 px-2.5 py-1 rounded-full'>{post.type}</span><button onClick={() => toggleFavorite(post.id)} className='rounded-full p-1.5 hover:bg-zinc-100'><Heart className={`w-5 h-5 ${favoriteIds.includes(post.id) ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} /></button></div><h3 className='font-black text-xl mt-3'>{post.title}</h3><div className='mt-2 text-sm flex gap-2 items-center text-zinc-600'><MapPin className='w-4 h-4' />{post.loc}</div><div className='mt-3 font-bold'>{post.price}</div><div className='text-green-700 text-sm font-semibold mt-1'>Quantity left: {post.qtyLeft} / {post.qtyTotal}</div><div className='text-xs text-zinc-500 mt-1'>{post.highlight}</div><div className='mt-4 flex gap-2 flex-wrap'><a href={safeWhatsapp(post.whatsapp, post.title, selectedParish)} target='_blank' rel='noreferrer' className='px-3 py-2 rounded-xl border flex gap-2 items-center hover:bg-zinc-50'><MessageCircle className='w-4 h-4' />WhatsApp</a><button onClick={() => setDetailCard(post)} className='px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800'>{post.type === 'Talent' ? 'Book Talent' : 'Learn More'}</button></div></motion.div>;

  const navItems = [
    ['home', label(language, 'Home', 'Home')], ['marketplace', label(language, 'Market', 'Market')], ['support', label(language, 'Support', 'Support')], ['events', label(language, 'Events', 'Events')], ['post', label(language, 'Post', 'Post')], ['partners', label(language, 'Ads', 'Ads')], ['saved', label(language, 'Saved', 'Saved')], ['account', label(language, 'Account', 'Account')],
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 text-zinc-900'>
      <header className='sticky top-0 z-30 bg-white/90 backdrop-blur border-b px-4 md:px-8 py-4'>
        <div className='max-w-[1400px] mx-auto flex flex-wrap gap-4 items-start justify-between'>
          <div>
            <div className='text-3xl font-black tracking-tight'>{APP_NAME}</div>
            <div className='text-green-700 font-semibold flex items-center gap-2'><span>{MARKETS[market]}</span><motion.span animate={{ rotate: [0, 15, 0, -15, 0] }} transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 2 }} className='inline-block origin-bottom'>👋</motion.span></div>
            <div className='text-sm text-zinc-500'>{label(language, 'Neighbors helping neighbors, selling to neighbors.', 'Nabor a help nabor, a sell to nabor too.')}</div>
            <div className='text-xs text-zinc-400 mt-1'>Near you: {selectedParish === 'All' ? 'All locations' : selectedParish}</div>
            <div className='text-[11px] mt-1 text-zinc-400'>{isLive ? 'Live Supabase mode' : 'Preview mode'}</div>
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
            <div className='mt-6 flex gap-3 flex-wrap'><button onClick={() => setTab('marketplace')} className='px-4 py-3 rounded-xl bg-white text-black font-semibold'>{label(language, 'Explore Marketplace', 'Explore di Marketplace')}</button><button onClick={() => setTab('support')} className='px-4 py-3 rounded-xl border border-white/70 font-semibold'>{label(language, 'Food & Support', 'Food & Support')}</button><button onClick={() => setTab('post')} className='px-4 py-3 rounded-xl border border-white/70 font-semibold'>{label(language, 'Post to Naborhood', 'Post to di Naborhood')}</button></div>
          </div>
        </div>
      </section>

      <nav className='px-4 md:px-8 pb-2'>
        <div className='max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2'>
          {navItems.map(([t, text]) => <button key={t} onClick={() => setTab(t)} className={`w-full px-3 py-2 rounded-full border text-sm text-center ${tab === t ? 'bg-black text-white border-black' : 'bg-white hover:bg-zinc-50'}`}>{text}</button>)}
        </div>
      </nav>

      <main className='p-4 md:p-8 max-w-[1400px] mx-auto overflow-x-hidden'>
        <div className='mb-5 grid gap-3'>
          <div className='flex flex-wrap gap-3 items-center'>
            <select value={selectedParish} onChange={(e) => setSelectedParish(e.target.value)} className='border rounded-2xl px-4 py-3 bg-white'>{parishOptions.map((p) => <option key={p} value={p}>{p}</option>)}</select>
            <div className='text-sm text-zinc-600'>Filtered by parish / location</div>
            <div className='relative min-w-[260px] flex-1 max-w-xl'><Search className='w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400' /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search food, services, donations, talent...' className='border rounded-2xl pl-11 pr-4 py-3 bg-white w-full' /></div>
            <button onClick={() => setMapMode(!mapMode)} className='border rounded-2xl px-4 py-3 bg-white flex items-center gap-2'><Navigation className='w-4 h-4' />{mapMode ? 'List View' : 'Map View'}</button>
            <button onClick={() => setAlertsOn(!alertsOn)} className={`border rounded-2xl px-4 py-3 flex items-center gap-2 ${alertsOn ? 'bg-green-700 text-white' : 'bg-white'}`}><Bell className='w-4 h-4' />{alertsOn ? 'Alerts On' : 'Alerts Off'}</button>
            {adminMode ? <button onClick={() => setShowExamples(!showExamples)} className={`border rounded-2xl px-4 py-3 flex items-center gap-2 ${showExamples ? 'bg-amber-100 text-zinc-900' : 'bg-white'}`}><Gift className='w-4 h-4' />{showExamples ? 'Examples On' : 'Examples Off'}</button> : null}
          </div>
          {mapMode && <div className='bg-white rounded-[24px] border shadow-sm p-5'><div className='font-black text-xl mb-3'>Map Mode</div><div className='grid md:grid-cols-3 gap-3'>{visiblePosts.map((post) => <div key={post.id} className='rounded-2xl border p-4 bg-amber-50'><div className='font-semibold'>{post.title}</div><div className='text-sm text-zinc-600 mt-1'>{post.loc}</div><div className='mt-2 text-xs text-green-700'>Pin active</div></div>)}</div></div>}
        </div>

        {error ? <div className='mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>{error}</div> : null}
        {loading ? <div className='rounded-[24px] border bg-white p-10 flex items-center justify-center gap-3 text-zinc-600'><Loader2 className='w-5 h-5 animate-spin' /><span>Loading app data…</span></div> : null}

        {!loading && tab === 'home' && <div className='space-y-7'><div className='grid grid-cols-2 xl:grid-cols-4 gap-4'><KpiCard title='Active Listings' value={posts.length} /><KpiCard title='Food Support' value={supportPosts.length} /><KpiCard title='Local Talent' value={posts.filter((p) => p.type === 'Talent').length} /><KpiCard title='Events Nearby' value={events.length} /></div><div className='grid xl:grid-cols-[1.35fr_.65fr] gap-6'><div><div className='flex items-center justify-between gap-3 mb-5'><h2 className='text-3xl font-black'>Featured in Naborly</h2><button onClick={() => setTab('marketplace')} className='text-sm font-semibold text-green-700'>View all</button></div><div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visiblePosts.map(renderPostCard)}</div></div><div className='space-y-4'><div className='bg-white rounded-[24px] border shadow-sm p-6'><h3 className='font-black text-2xl'>Quick Access</h3><div className='mt-4 grid gap-3'><button onClick={() => setTab('support')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50'><div className='font-semibold'>Food & Support</div><div className='text-sm text-zinc-600'>See free food, services, donations, and Med Support.</div></button><button onClick={() => setTab('events')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50'><div className='font-semibold'>Events in the Naborhood</div><div className='text-sm text-zinc-600'>Find nearby events, RSVP, and buy tickets.</div></button><button onClick={() => setTab('post')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50'><div className='font-semibold'>Post to Naborhood</div><div className='text-sm text-zinc-600'>Sell, donate, promote, or share a service.</div></button></div></div><div className='bg-white rounded-[24px] border shadow-sm p-6'><h3 className='font-black text-2xl'>Share & Earn Elite</h3><p className='mt-2 text-sm text-zinc-600'>Earn Nabor Points when friends join, post, buy, sell, or reserve through your invite.</p><div className='mt-4 grid gap-3'><div className='rounded-2xl bg-amber-50 border p-4'><div className='text-xs text-zinc-500'>Referral Code</div><div className='font-black text-lg'>{DEFAULT_REFERRAL}</div></div><div className='grid grid-cols-3 gap-2'><div className='rounded-2xl border p-3 text-center'><div className='text-xs text-zinc-500'>Points</div><div className='font-black text-xl'>1,250</div></div><div className='rounded-2xl border p-3 text-center'><div className='text-xs text-zinc-500'>Referrals</div><div className='font-black text-xl'>18</div></div><div className='rounded-2xl border p-3 text-center'><div className='text-xs text-zinc-500'>Payout</div><div className='font-black text-xl'>{market === 'JA' ? 'JMD $42' : market === 'UK' ? 'GBP £42' : 'USD $42'}</div></div></div><button className='rounded-2xl border p-3 flex items-center gap-2 text-left'><QrCode className='w-4 h-4' />QR code (scan to join with your referral)</button><a href={shareWhatsApp(`Join me on ${APP_NAME} with my invite code ${DEFAULT_REFERRAL}`)} target='_blank' rel='noreferrer' className='rounded-2xl border p-3 flex items-center gap-2'><MessageCircle className='w-4 h-4' />Share via WhatsApp</a><button className='rounded-2xl border p-3 flex items-center gap-2'><Share2 className='w-4 h-4' />Share to TikTok</button><button className='rounded-2xl border p-3 flex items-center gap-2'><Share2 className='w-4 h-4' />Share to Instagram</button><button className='rounded-2xl bg-green-700 text-white p-3 font-semibold'>Cash Out Rewards</button></div></div></div></div></div>}

        {!loading && tab === 'marketplace' && <div><div className='flex items-center justify-between gap-4 mb-5 flex-wrap'><h2 className='text-3xl font-black'>Marketplace</h2><div className='text-sm text-zinc-600'>Clean cards. Full details open in the next step.</div></div><div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visiblePosts.map(renderPostCard)}</div></div>}

        {!loading && tab === 'support' && <div className='space-y-6'><div><h2 className='text-3xl font-black mb-4'>Food & Support</h2><div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{supportPosts.map(renderPostCard)}</div></div><div className='grid md:grid-cols-2 gap-4'><div className='bg-white p-6 rounded-[24px] border shadow-sm'><Gift className='mb-2' /><div className='font-black text-xl'>Free meals and services</div><div className='text-zinc-600 mt-2'>Production-ready concept: browse, reserve, and connect instantly via WhatsApp for all free support items.</div></div><div className='bg-white p-6 rounded-[24px] border shadow-sm'><Store className='mb-2' /><div className='font-black text-xl'>Med Support</div><div className='text-zinc-600 mt-2'>Ready to connect prescription upload, pharmacy routing, payment, reserve, and pickup verification in production.</div></div></div></div>}

        {!loading && tab === 'events' && <div className='space-y-6'><div className='flex items-start justify-between gap-4 flex-wrap'><div><h2 className='text-3xl font-black'>Events in the Naborhood</h2><div className='text-sm text-zinc-600 mt-1'>Weekend picks, RSVP, direct host WhatsApp links, and ticket sales.</div><div className='mt-2 rounded-2xl bg-gradient-to-r from-black to-zinc-700 text-white p-4 text-sm'>🔥 Featured events • Ticket sales • Promote events • Naborly marketplace operator mode</div></div><div className='flex gap-2 flex-wrap'><select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className='rounded-2xl border px-4 py-3 bg-white'><option>All</option>{(PARISH_MAP[market] || []).map((p) => <option key={p}>{p}</option>)}</select><button onClick={() => setDetailCard({ ...(posts[0] || MOCK_POSTS[0]), title: 'Promote Your Event', type: 'Event Promo', desc: 'Feature your event across Naborly.', free: false, price: 'JMD 2,000', qtyLeft: 1, qtyTotal: 1, vendor: 'Naborly Marketplace', whatsapp: '18765559999', tracking: 'Confirmed', loc: selectedParish === 'All' ? 'All parishes' : selectedParish })} className='rounded-2xl bg-black text-white px-4 py-3'>Promote Event</button></div></div><div className='grid xl:grid-cols-[1.15fr_.85fr] gap-4'><div><div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visibleEvents.map((ev) => <div key={ev.id} className='bg-white rounded-[24px] p-5 border shadow-sm'><div className='flex items-start justify-between gap-3'><span className='text-xs font-bold bg-amber-100 px-2.5 py-1 rounded-full'>{ev.featured ? 'Featured Event' : 'Event'}</span><button onClick={() => toggleSavedEvent(ev.id)} className='rounded-full p-1 hover:bg-zinc-100'><Heart className={`w-5 h-5 ${savedEventIds.includes(ev.id) ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} /></button></div><h3 className='font-black text-xl mt-3'>{ev.title}</h3><div className='mt-2 text-sm text-zinc-600 flex items-center gap-2'><MapPin className='w-4 h-4' />{ev.loc}</div><div className='mt-1 text-sm text-zinc-600'>{ev.date}</div><div className='mt-1 text-xs text-green-700 font-medium'>Tickets / RSVP available</div><div className='mt-1 text-sm font-semibold'>{ev.price}</div><div className='mt-3 text-sm'>{ev.desc}</div><div className='mt-4 flex gap-2 flex-wrap'><a href={safeWhatsapp(ev.whatsapp, ev.title, selectedParish)} target='_blank' rel='noreferrer' className='px-3 py-2 rounded-xl border flex gap-2 items-center hover:bg-zinc-50'><MessageCircle className='w-4 h-4' />WhatsApp Host</a><button onClick={() => setTab('account')} className='px-3 py-2 rounded-xl bg-green-700 text-white'>RSVP</button><button onClick={() => setDetailCard({ ...(posts[0] || MOCK_POSTS[0]), title: `${ev.title} Tickets`, type: 'Event Ticket', desc: ev.desc, free: ev.price === 'Free', price: ev.price, qtyLeft: 50, qtyTotal: 50, vendor: ev.host, whatsapp: ev.whatsapp, tracking: 'Confirmed', loc: ev.loc })} className='px-3 py-2 rounded-xl bg-black text-white'>Buy Ticket</button><button className='px-3 py-2 rounded-xl border flex items-center gap-1'><CalendarPlus className='w-4 h-4' />Add</button><button className='px-3 py-2 rounded-xl border flex items-center gap-1'><Share2 className='w-4 h-4' />Share</button></div></div>)}</div></div><div className='space-y-4'><div className='bg-white rounded-[24px] p-5 border shadow-sm'><div className='font-black text-xl'>Naborly as Marketplace Operator</div><p className='mt-2 text-sm text-zinc-600'>You are the marketplace. Naborly can host event traffic, vendor booths, promoted listings, and ticketing as the platform owner.</p><div className='mt-4 grid gap-3'><div className='rounded-2xl border p-4 bg-amber-50'><div className='font-semibold'>Platform Revenue</div><div className='text-sm text-zinc-600 mt-1'>Event promotions, ticket fees, vendor booth bookings, featured placements.</div></div><div className='rounded-2xl border p-4'><div className='font-semibold'>Operator Controls</div><div className='text-sm text-zinc-600 mt-1'>Approve events • Feature events • Manage hosts • Track bookings.</div></div></div></div><div className='bg-white rounded-[24px] p-5 border shadow-sm'><div className='font-black text-xl'>Ultra Max Event Tools</div><div className='mt-2 text-sm text-zinc-600'>{eventToolMessage}</div><div className='mt-4 grid gap-3'><button onClick={() => setEventToolMessage('QR ticket scan check-in is active in preview mode. Operators can validate tickets at entry.')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50 flex items-center justify-between'><span>QR ticket scan check-in</span><span className={`text-xs px-2 py-1 rounded-full ${eventToolState.qr ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{eventToolState.qr ? 'Active' : 'Off'}</span></button><button onClick={() => setEventToolMessage('VIP / General Admission tiers are active in preview mode. Event tickets can be split into premium and standard access.')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50 flex items-center justify-between'><span>VIP / General Admission tiers</span><span className={`text-xs px-2 py-1 rounded-full ${eventToolState.vip ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{eventToolState.vip ? 'Active' : 'Off'}</span></button><button onClick={() => setEventToolMessage('Vendor booth booking is active in preview mode. Naborly can sell booth spots as the marketplace operator.')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50 flex items-center justify-between'><span>Vendor booth booking</span><span className={`text-xs px-2 py-1 rounded-full ${eventToolState.booths ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{eventToolState.booths ? 'Active' : 'Off'}</span></button><button onClick={() => setEventToolMessage('Countdown timer + seat count is active in preview mode. Buyers can see urgency and availability before checkout.')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50 flex items-center justify-between'><span>Countdown timer + seat count</span><span className={`text-xs px-2 py-1 rounded-full ${eventToolState.countdown ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{eventToolState.countdown ? 'Active' : 'Off'}</span></button></div><div className='mt-4 rounded-2xl bg-amber-50 border p-4 text-sm text-zinc-700'>Because you are the marketplace, these tools are positioned as operator tools for Naborly to manage ticketing, booths, access, and event monetization.</div></div></div></div></div>}

        {!loading && tab === 'post' && <div className='max-w-3xl bg-white p-6 rounded-[28px] border shadow-sm space-y-4'><h2 className='text-3xl font-black'>Post to Naborhood</h2><div className='grid md:grid-cols-2 gap-3'><select className='w-full border rounded-2xl p-3'>{(PARISH_MAP[market] || []).map((p) => <option key={p}>{p}</option>)}</select><input className='w-full border rounded-2xl p-3' placeholder='Title' /><input className='w-full border rounded-2xl p-3' placeholder='Landmark / near location' /><input className='w-full border rounded-2xl p-3' placeholder='Total quantity available' /><input className='w-full border rounded-2xl p-3' placeholder='Quantity left' /></div><textarea className='w-full border rounded-2xl p-3 min-h-[120px]' placeholder='Describe item or service' /><label className='w-full border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-zinc-50'><Upload className='w-5 h-5' /><span>Upload product or service image</span><input type='file' className='hidden' /></label><button className='px-4 py-3 rounded-2xl bg-green-700 text-white flex gap-2 items-center font-semibold hover:bg-green-800'><PlusCircle className='w-4 h-4' />Post Now</button></div>}

        {!loading && tab === 'partners' && <div className='grid md:grid-cols-3 gap-4'><div className='bg-white p-6 rounded-[24px] border shadow-sm'><div className='font-black text-xl'>Featured Vendor</div><div className='mt-2 text-zinc-600'>Promote products & services</div><div className='mt-2 text-xs text-green-700'>Local payment methods accepted</div><button onClick={() => setDetailCard({ ...(posts[0] || MOCK_POSTS[0]), title: 'Featured Vendor Plan', type: 'Partner Plan', desc: 'Promote your products and services to more neighborhoods.', free: false, price: 'JMD 3,000 / month' })} className='mt-4 px-3 py-2 rounded-xl bg-black text-white'>Subscribe</button></div><div className='bg-white p-6 rounded-[24px] border shadow-sm'><div className='font-black text-xl'>Promote Event</div><div className='mt-2 text-zinc-600'>Reach local neighborhoods</div><div className='mt-2 text-xs text-green-700'>Local payment methods accepted</div><button onClick={() => setDetailCard({ ...(posts[0] || MOCK_POSTS[0]), title: 'Promote Event', type: 'Ad Plan', desc: 'Advertise your event placement and reach more people.', free: false, price: 'JMD 2,000' })} className='mt-4 px-3 py-2 rounded-xl bg-black text-white'>Pay</button></div><div className='bg-white p-6 rounded-[24px] border shadow-sm'><div className='font-black text-xl'>Business Pro</div><div className='mt-2 text-zinc-600'>Top placement + ads</div><div className='mt-2 text-xs text-green-700'>Local payment methods accepted</div><button onClick={() => setDetailCard({ ...(posts[0] || MOCK_POSTS[0]), title: 'Business Pro', type: 'Partner Plan', desc: 'Top placement, ads, and more visibility.', free: false, price: 'JMD 10,000 / month' })} className='mt-4 px-3 py-2 rounded-xl bg-black text-white'>Upgrade</button></div></div>}

        {!loading && tab === 'saved' && <div className='bg-white p-6 rounded-[24px] border shadow-sm'><h2 className='text-3xl font-black'>Saved & Followed</h2><p className='mt-2 text-zinc-600'>Your hearted posts appear here.</p><div className='mt-5 grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{favoritePosts.length ? favoritePosts.map(renderPostCard) : <p>No favorites yet.</p>}</div></div>}

        {!loading && tab === 'account' && <div className='grid xl:grid-cols-[1fr_.9fr] gap-4 items-start'><div className='bg-white p-6 rounded-[28px] border shadow-sm'><User className='mb-2' /><h2 className='text-3xl font-black'>Account</h2><p className='mt-2 text-zinc-600'>Create account, sign in, manage favorites, and share Naborly.</p><div className='mt-5 grid gap-3'><button onClick={() => setShowSignup(true)} className='rounded-2xl bg-green-700 text-white px-4 py-3 font-semibold hover:bg-green-800'>Open Signup Form</button><button className='rounded-2xl border px-4 py-3 font-semibold hover:bg-zinc-50'>Sign Out</button><button onClick={() => setAdminMode(!adminMode)} className={`rounded-2xl border px-4 py-3 font-semibold ${adminMode ? 'bg-black text-white border-black' : 'hover:bg-zinc-50'}`}>{adminMode ? 'Admin Mode On' : 'Admin Mode Off'}</button>{adminMode ? <button onClick={() => setShowExamples(!showExamples)} className='rounded-2xl border px-4 py-3 font-semibold hover:bg-zinc-50'>{showExamples ? 'Hide Example Content' : 'Show Example Content'}</button> : null}</div></div><div className='bg-white p-6 rounded-[28px] border shadow-sm'><CalendarDays className='mb-2' /><h2 className='text-2xl font-black'>Tracking</h2><p className='mt-2 text-zinc-600'>Live progress for your latest order or reservation.</p><div className='mt-5 rounded-2xl border bg-amber-50 p-4'><div className='text-xs text-zinc-500'>Current item</div><div className='font-black text-lg mt-1'>{trackingView.title}</div><div className='text-sm text-zinc-600 mt-1'>{trackingView.loc}</div></div><div className='mt-6'><div className='flex justify-between text-xs text-zinc-500 mb-2'><span>Reserved</span><span>Delivered</span></div><div className='relative h-3 rounded-full bg-zinc-200 overflow-hidden'><div className='absolute inset-y-0 left-0 bg-green-600 rounded-full transition-all duration-500' style={{ width: `${((trackingIndex(trackingView.tracking) + 1) / TRACKING_STEPS.length) * 100}%` }} /></div></div><div className='mt-5 grid grid-cols-5 gap-2 text-center'>{TRACKING_STEPS.map((step, idx) => <div key={step}><div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx <= trackingIndex(trackingView.tracking) ? 'bg-green-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>{idx < trackingIndex(trackingView.tracking) ? '✓' : idx + 1}</div><div className='text-[10px] mt-1 text-zinc-500 leading-tight'>{step}</div></div>)}</div><div className='mt-5 rounded-2xl border p-4 bg-white'><div className='text-xs text-zinc-500'>Current status</div><div className='mt-1 flex items-center gap-2 font-semibold text-green-700'>{statusIcon(trackingView.tracking)}<span>{trackingView.tracking}</span></div></div></div></div>}
      </main>

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} market={market} />
      <CardDetailModal card={detailCard} onClose={() => setDetailCard(null)} onReserve={(card) => { setTrackingView(card); setTab('account'); setDetailCard(null); }} market={market} />
    </div>
  );
}
