import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MapPin, MessageCircle, PlusCircle, User, Store, Gift, CalendarDays, X, Phone,
  CreditCard, Truck, Clock3, CheckCircle2, Upload, Bell, Navigation, CalendarPlus,
  Search, Share2, QrCode, Wallet, Loader2,
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
  { id: 'e2', title: 'Vendor Pop-Up Market', loc: 'Montego Bay', date: 'Sun 11:00 PM', host: 'Island Makers', whatsapp: '18765552002', desc: 'Local vendors, food, music, gifts.', price: 'JMD 500', featured: true },
  { id: 'e3', title: 'Youth Football Clinic', loc: 'St. James', date: 'Fri 4:00 PM', host: 'Coach Devon', whatsapp: '18765552003', desc: 'Free youth sports training.', price: 'Free', featured: false },
];

const MOCK_POSTS = [
  { id: 'p1', title: 'Fresh Fruit Bags', type: 'Food', price: 'JMD $700', loc: 'Kingston • Near St. Bess Pharmacy', parish: 'Kingston', qtyTotal: 10, qtyLeft: 8, desc: 'Fresh banana, orange, pineapple, and mango bags available for same-day pickup.', vendor: 'Marcia Produce', whatsapp: '18765551001', free: false, tracking: 'Ready for pickup', highlight: 'Pickup today', imageUrl: '' },
  { id: 'p2', title: 'Restaurant Meal Donations', type: 'Free Support', price: 'Free', loc: 'Kingston • Half Way Tree', parish: 'Kingston', qtyTotal: 20, qtyLeft: 12, desc: 'Prepared meals available while supplies last. First come, first served.', vendor: 'Island Kitchen', whatsapp: '18765551002', free: true, tracking: 'On the way', highlight: 'Donation pickup', imageUrl: '' },
  { id: 'p3', title: 'Driver for Appointments', type: 'Talent', price: 'From JMD $2,000', loc: 'Montego Bay', parish: 'St. James', qtyTotal: 6, qtyLeft: 5, desc: 'Reliable local rides for appointments, school pickup, and errands.', vendor: 'Andre Rides', whatsapp: '18765551003', free: false, tracking: 'Reserved', highlight: '5 slots open', imageUrl: '' },
  { id: 'p4', title: 'Community Cleaning Help', type: 'Free Support', price: 'Free', loc: 'St. Andrew • Near Hope Gardens', parish: 'St. Andrew', qtyTotal: 4, qtyLeft: 2, desc: 'Volunteer cleaning help available for seniors and urgent situations.', vendor: 'Nabor Volunteers', whatsapp: '18765551004', free: true, tracking: 'Reserved', highlight: '2 slots left', imageUrl: '' },
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
      qtyTotal: row.qty_total ?? 0, qtyLeft: row.qty_left ?? 0, desc: row.desc, vendor: row.vendor,
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
      whatsapp: row.whatsapp, desc: row.desc, price: row.price, featured: Boolean(row.featured),
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
      const [postsData, eventsData, favoritesData, savedEventsData] = await Promise.all([
        api.getPosts(), api.getEvents(), api.getFavorites(), api.getSavedEvents(),
      ]);
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
    if (!supabase) { setMessage('Supabase not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live signup.'); return; }
    try {
      setSaving(true); setMessage('');
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, whatsapp, market, parish } } });
      if (error) throw error;
      const userId = data.user?.id;
      if (userId) { await supabase.from('profiles').upsert({ id: userId, full_name: fullName, email, whatsapp, market, parish }); }
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

export default function OriginalNaborly() { return <div className='min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 text-zinc-900'><div className='p-10 text-center text-zinc-700'>Use the full App.jsx from the launch kit zip. This placeholder exists only if copy/paste truncates here.</div></div>; }
