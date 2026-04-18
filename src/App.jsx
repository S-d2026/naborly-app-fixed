import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MapPin, MessageCircle, PlusCircle, User, Store, Gift, CalendarDays, X, Phone,
  CreditCard, Truck, Clock3, CheckCircle2, Upload, Bell, Navigation, CalendarPlus,
  Search, Share2, QrCode, Wallet, Loader2, Megaphone, UtensilsCrossed, Pill, Copy, ExternalLink
} from 'lucide-react';

const APP_NAME = 'Naborly';
const DEFAULT_REFERRAL = 'NABOR-2026';
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
const ADMIN_EMAIL = import.meta.env?.VITE_ADMIN_EMAIL || '';
const APP_BASE_URL = import.meta.env?.VITE_APP_BASE_URL || window.location.origin;
const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabase ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const MARKETS = {
  JA: 'Welcome to Naborly JA',
  UK: 'Welcome to Naborly UK',
  BB: 'Welcome to Naborly Barbados',
  LA: 'Welcome to Naborly Latin America',
  AF: 'Welcome to Naborly Africa',
  WW: 'Welcome to Naborly Worldwide',
};

const PAYMENT_OPTIONS = {
  JA: ['Debit/Credit Card', 'Lynk Wallet', 'NCB Pay', 'WiPay', 'Cash on Pickup'],
  UK: ['Debit/Credit Card', 'Apple Pay', 'Google Pay', 'PayPal', 'Cash on Pickup'],
  BB: ['Debit/Credit Card', 'WiPay', 'Bank Transfer', 'Cash on Pickup'],
  LA: ['Debit/Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Pickup'],
  AF: ['Debit/Credit Card', 'Mobile Money', 'Bank Transfer', 'Cash on Pickup'],
  WW: ['Debit/Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Pickup'],
};

const CURRENCY_MAP = { JA: 'JMD', UK: 'GBP', BB: 'BBD', LA: 'USD', AF: 'USD', WW: 'USD' };

const PARISH_MAP = {
  JA: ['Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon', 'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James', 'Trelawny', 'St. Ann', 'St. Mary', 'Portland', 'St. Thomas'],
  UK: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Liverpool'],
  BB: ['Christ Church', 'St. Michael', 'St. James', 'St. Philip'],
  LA: ['Santo Domingo', 'San Juan', 'Port-au-Prince', 'Kingston DR'],
  AF: ['Lagos', 'Accra', 'Nairobi', 'Johannesburg'],
  WW: ['Global'],
};

const TRACKING_STEPS = ['Reserved', 'Confirmed', 'On the way', 'Ready for pickup', 'Delivered'];

const MOCK_POSTS = [
  { id: 'p1', title: 'Fresh Fruit Bags', type: 'Food', price: 'JMD $700', loc: 'Kingston • Near St. Bess Pharmacy', parish: 'Kingston', qtyTotal: 10, qtyLeft: 8, description: 'Fresh banana, orange, pineapple, and mango bags available for same-day pickup.', vendor: 'Marcia Produce', whatsapp: '18765551001', free: false, tracking: 'Ready for pickup', highlight: 'Pickup today', imageUrl: '', promoted: false },
  { id: 'p2', title: 'Restaurant Meal Donations', type: 'Free Support', price: 'Free', loc: 'Kingston • Half Way Tree', parish: 'Kingston', qtyTotal: 20, qtyLeft: 12, description: 'Prepared meals available while supplies last. First come, first served.', vendor: 'Island Kitchen', whatsapp: '18765551002', free: true, tracking: 'On the way', highlight: 'Donation pickup', imageUrl: '', promoted: true },
  { id: 'p3', title: 'Driver for Appointments', type: 'Talent', price: 'From JMD $2,000', loc: 'Montego Bay', parish: 'St. James', qtyTotal: 6, qtyLeft: 5, description: 'Reliable local rides for appointments, school pickup, and errands.', vendor: 'Andre Rides', whatsapp: '18765551003', free: false, tracking: 'Reserved', highlight: '5 slots open', imageUrl: '', promoted: false },
  { id: 'p4', title: 'Community Cleaning Help', type: 'Free Support', price: 'Free', loc: 'St. Andrew • Near Hope Gardens', parish: 'St. Andrew', qtyTotal: 4, qtyLeft: 2, description: 'Volunteer cleaning help available for seniors and urgent situations.', vendor: 'Nabor Volunteers', whatsapp: '18765551004', free: true, tracking: 'Reserved', highlight: '2 slots left', imageUrl: '', promoted: false },
  { id: 'p5', title: 'Medication Pickup Help', type: 'Free Support', price: 'Free', loc: 'Kingston • Near Medical Plaza', parish: 'Kingston', qtyTotal: 8, qtyLeft: 6, description: 'Volunteer help with pharmacy pickup and essential medication support.', vendor: 'Nabor Med Helpers', whatsapp: '18765551005', free: true, tracking: 'Confirmed', highlight: 'Med support', imageUrl: '', promoted: false },
];

const MOCK_EVENTS = [
  { id: 'e0', title: 'Kingston Night Market', loc: 'Kingston', date: 'Tonight 7:00 PM', host: 'City Events', whatsapp: '18765552000', description: 'Food, music, shopping, and family fun.', price: 'JMD 1500', featured: true, promoted: true },
  { id: 'e1', title: 'Community Food Drive', loc: 'Kingston', date: 'Sat 2:00 PM', host: 'Nabor Volunteers', whatsapp: '18765552001', description: 'Free groceries and family support.', price: 'Free', featured: false, promoted: false },
  { id: 'e2', title: 'Vendor Pop-Up Market', loc: 'Montego Bay', date: 'Sun 11:00 AM', host: 'Island Makers', whatsapp: '18765552002', description: 'Local vendors, food, music, gifts.', price: 'JMD 500', featured: true, promoted: true },
];

function getCurrency(market) { return CURRENCY_MAP[market] || 'USD'; }
function getPaymentOptions(market) { return PAYMENT_OPTIONS[market] || PAYMENT_OPTIONS.WW; }
function wait(ms = 180) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function safeWhatsapp(number, title, area = '') {
  const clean = String(number || '').replace(/\D/g, '');
  const areaText = area && area !== 'All' ? ` (${area})` : '';
  const text = encodeURIComponent(`Hi, I saw "${title}" on ${APP_NAME}${areaText}. Is it still available?`);
  return `https://wa.me/${clean}?text=${text}`;
}
function shareWhatsApp(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
function trackingIndex(status) {
  return Math.max(0, TRACKING_STEPS.indexOf(status));
}
function statusIcon(status) {
  if (status === 'Delivered') return <CheckCircle2 className='w-4 h-4' />;
  if (status === 'On the way') return <Truck className='w-4 h-4' />;
  return <Clock3 className='w-4 h-4' />;
}
function buildDeepLink(params = {}) {
  const url = new URL(APP_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  return url.toString();
}
function qrImageUrl(target) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(target)}`;
}

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
      description: row.description,
      vendor: row.vendor,
      whatsapp: row.whatsapp,
      free: Boolean(row.free),
      tracking: row.tracking || 'Reserved',
      highlight: row.highlight || '',
      imageUrl: row.image_url || '',
      promoted: Boolean(row.promoted),
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
      description: row.description,
      price: row.price,
      featured: Boolean(row.featured),
      promoted: Boolean(row.promoted),
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
      setFavoriteIds(await api.toggleFavorite(favoriteIds, id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update favorites.');
    }
  }, [api, favoriteIds]);

  const toggleSavedEvent = useCallback(async (id) => {
    try {
      setSavedEventIds(await api.toggleSavedEvent(savedEventIds, id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update saved events.');
    }
  }, [api, savedEventIds]);

  return { posts, events, favoriteIds, savedEventIds, loading, error, toggleFavorite, toggleSavedEvent, isLive: hasSupabase };
}

function ShareModal({ open, onClose, title, targetUrl, whatsappMessage }) {
  const [copied, setCopied] = useState('');
  if (!open) return null;

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`${label} copied`);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setCopied('Copy failed');
    }
  };

  return (
    <AnimatePresence>
      <motion.div className='fixed inset-0 z-50 bg-black/55 p-4 flex items-center justify-center overflow-y-auto' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className='w-full max-w-3xl rounded-[30px] bg-white p-6 md:p-7 shadow-2xl max-h-[92vh] overflow-y-auto'>
          <div className='flex justify-between items-start gap-4'>
            <div>
              <h3 className='text-2xl font-black'>Share {title}</h3>
              <p className='text-zinc-600 mt-2'>Use WhatsApp, social links, or QR for flyers and printouts.</p>
            </div>
            <button onClick={onClose} className='rounded-xl border p-2 hover:bg-zinc-50'><X className='w-5 h-5' /></button>
          </div>
          <div className='grid lg:grid-cols-[.9fr_1.1fr] gap-6 mt-5'>
            <div className='rounded-[24px] border p-5 flex flex-col items-center bg-zinc-50'>
              <img src={qrImageUrl(targetUrl)} alt='Share QR' className='w-56 h-56 rounded-2xl border bg-white p-2' />
              <div className='mt-3 text-sm text-zinc-600 text-center'>QR opens the live share page. Use it on flyers, posters, or cards.</div>
            </div>
            <div className='space-y-3'>
              <a href={shareWhatsApp(whatsappMessage)} target='_blank' rel='noreferrer' className='w-full rounded-2xl border p-4 flex items-center gap-3 hover:bg-zinc-50'><MessageCircle className='w-5 h-5' />Share on WhatsApp</a>
              <button onClick={() => copyText(targetUrl, 'Share link')} className='w-full rounded-2xl border p-4 flex items-center gap-3 hover:bg-zinc-50'><Copy className='w-5 h-5' />Copy app link</button>
              <button onClick={() => copyText(whatsappMessage, 'Share message')} className='w-full rounded-2xl border p-4 flex items-center gap-3 hover:bg-zinc-50'><Copy className='w-5 h-5' />Copy share text</button>
              <a href={targetUrl} target='_blank' rel='noreferrer' className='w-full rounded-2xl border p-4 flex items-center gap-3 hover:bg-zinc-50'><ExternalLink className='w-5 h-5' />Open landing page</a>
              <button
                onClick={async () => {
                  const payload = { title: `${APP_NAME} share`, text: whatsappMessage, url: targetUrl };
                  if (navigator.share) {
                    try { await navigator.share(payload); } catch {}
                  } else {
                    copyText(targetUrl, 'Share link');
                  }
                }}
                className='w-full rounded-2xl bg-green-700 text-white p-4 flex items-center gap-3 hover:bg-green-800'
              >
                <Share2 className='w-5 h-5' />System share / social share
              </button>
              {copied ? <div className='text-sm text-green-700 font-medium'>{copied}</div> : null}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
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
              <p className='mt-4 text-zinc-700 leading-7'>{card.description}</p>
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
                {!card.free ? (
                  <div className='grid grid-cols-2 gap-2'>
                    {getPaymentOptions(market).map((pay) => (
                      <button key={pay} className='rounded-2xl border p-3 flex items-center justify-center gap-2 bg-white text-sm'>
                        {pay.includes('Card') && <CreditCard className='w-4 h-4' />}
                        {(pay.includes('Wallet') || pay.includes('Pay') || pay.includes('WiPay')) && <Wallet className='w-4 h-4' />}
                        {pay.includes('Pickup') && <Store className='w-4 h-4' />}
                        <span>{pay}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className='rounded-2xl border border-dashed bg-white p-4 text-sm text-zinc-600'>This item is free. Payment is not needed. Continue to reserve or arrange pickup.</div>
                )}
                <button onClick={() => onReserve(card)} className='w-full rounded-2xl bg-green-700 text-white px-4 py-3 font-bold hover:bg-green-800'>
                  {card.type === 'Talent' ? 'Book Talent' : card.free ? 'Reserve Free Item' : 'Secure Checkout'}
                </button>
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, whatsapp, market, parish } },
      });
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
            <button onClick={handleSignup} disabled={saving} className='w-full rounded-2xl bg-green-700 text-white py-3 font-bold hover:bg-green-800 disabled:opacity-60'>
              {saving ? 'Creating Account…' : 'Create Free Account'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PromoRibbon({ promo, onOpen }) {
  if (!promo) return null;
  return (
    <div className='px-4 md:px-8 pt-3'>
      <div className='max-w-[1400px] mx-auto'>
        <button onClick={() => onOpen(promo)} className='w-full rounded-2xl bg-black text-white px-4 py-3 flex items-center justify-between gap-4 hover:bg-zinc-800'>
          <div className='flex items-center gap-3 text-left'>
            <Megaphone className='w-5 h-5 shrink-0' />
            <div>
              <div className='font-semibold'>{promo.kind === 'event' ? 'Promoted Event' : 'Promoted Ad'}</div>
              <div className='text-sm text-white/80'>{promo.title} • {promo.subtitle}</div>
            </div>
          </div>
          <div className='text-sm font-semibold'>{promo.action}</div>
        </button>
      </div>
    </div>
  );
}

function SupportQuickCard({ icon, title, body, onClick }) {
  const Icon = icon;
  return (
    <button onClick={onClick} className='bg-white p-6 rounded-[24px] border shadow-sm text-left hover:shadow-md'>
      <Icon className='mb-2' />
      <div className='font-black text-xl'>{title}</div>
      <div className='text-zinc-600 mt-2'>{body}</div>
    </button>
  );
}

export default function App() {
  const [market, setMarket] = useState('JA');
  const [tab, setTab] = useState('home');
  const [detailCard, setDetailCard] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [trackingView, setTrackingView] = useState(MOCK_POSTS[1]);
  const [mapMode, setMapMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertsOn, setAlertsOn] = useState(false);
  const [eventFilter, setEventFilter] = useState('All');
  const [selectedParish, setSelectedParish] = useState('All');
  const [adminMode, setAdminMode] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [shareState, setShareState] = useState({ open: false, title: '', url: '', whatsapp: '' });
  const [supportMode, setSupportMode] = useState('all');
  const [promoIndex, setPromoIndex] = useState(0);

  const { posts, events, favoriteIds, savedEventIds, loading, error, toggleFavorite, toggleSavedEvent, isLive } = useAppData();

  useEffect(() => {
    let active = true;
    async function loadUser() {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (active) setCurrentUserEmail(data?.user?.email || '');
    }
    loadUser();
    const listener = supabase?.auth?.onAuthStateChange?.((_event, session) => {
      setCurrentUserEmail(session?.user?.email || '');
    });
    return () => {
      active = false;
      listener?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const isCreatorAdmin = Boolean(currentUserEmail && ADMIN_EMAIL && currentUserEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());

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
    const searchOk = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
    const supportOk =
      tab !== 'support' ||
      supportMode === 'all' ||
      (supportMode === 'meals' && /meal|food|fruit|grocer|donation/i.test(`${c.title} ${c.description}`)) ||
      (supportMode === 'med' && /med|pharmacy|prescription|clinic/i.test(`${c.title} ${c.description} ${c.vendor}`));
    return parishOk && searchOk && supportOk;
  }), [displayPosts, selectedParish, searchTerm, tab, supportMode]);
  const visibleEvents = useMemo(() => displayEvents.filter((ev) => {
    const parishOk = eventFilter === 'All' || ev.loc.toLowerCase().includes(eventFilter.toLowerCase());
    const q = searchTerm.toLowerCase().trim();
    const searchOk = !q || ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q);
    return parishOk && searchOk;
  }), [displayEvents, eventFilter, searchTerm]);

  const promoItems = useMemo(() => [
    ...displayEvents.filter((e) => e.promoted || e.featured).map((e) => ({ kind: 'event', title: e.title, subtitle: `${e.loc} • ${e.date}`, action: 'View Event', payload: e })),
    ...displayPosts.filter((p) => p.promoted).map((p) => ({ kind: 'ad', title: p.title, subtitle: p.highlight || p.loc, action: 'View Promo', payload: p })),
  ], [displayEvents, displayPosts]);

  useEffect(() => {
    if (!promoItems.length) return;
    const timer = setInterval(() => {
      setPromoIndex((i) => (i + 1) % promoItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [promoItems.length]);

  const openShare = useCallback((kind, payload) => {
    const slug = String(payload.title || kind).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const url = buildDeepLink({ tab: kind === 'event' ? 'events' : 'marketplace', item: slug, ref: DEFAULT_REFERRAL, market });
    const message = `Check out ${payload.title} on ${APP_NAME}. ${url}`;
    setShareState({ open: true, title: payload.title, url, whatsapp: message });
  }, [market]);

  const currentPromo = promoItems[promoIndex] || null;

  const renderPostCard = (post) => (
    <motion.div key={post.id} layout className='bg-white rounded-[24px] p-5 border shadow-sm hover:shadow-lg transition-shadow'>
      <div className='flex items-start justify-between gap-3'>
        <span className='text-xs font-bold bg-amber-100 px-2.5 py-1 rounded-full'>{post.type}</span>
        <button onClick={() => toggleFavorite(post.id)} className='rounded-full p-1.5 hover:bg-zinc-100'>
          <Heart className={`w-5 h-5 ${favoriteIds.includes(post.id) ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} />
        </button>
      </div>
      <h3 className='font-black text-xl mt-3'>{post.title}</h3>
      <div className='mt-2 text-sm flex gap-2 items-center text-zinc-600'><MapPin className='w-4 h-4' />{post.loc}</div>
      <div className='mt-3 font-bold'>{post.price}</div>
      <div className='text-green-700 text-sm font-semibold mt-1'>Quantity left: {post.qtyLeft} / {post.qtyTotal}</div>
      <div className='text-xs text-zinc-500 mt-1'>{post.highlight}</div>
      <div className='mt-4 flex gap-2 flex-wrap'>
        <a href={safeWhatsapp(post.whatsapp, post.title, selectedParish)} target='_blank' rel='noreferrer' className='px-3 py-2 rounded-xl border flex gap-2 items-center hover:bg-zinc-50'><MessageCircle className='w-4 h-4' />WhatsApp</a>
        <button onClick={() => setDetailCard(post)} className='px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800'>{post.type === 'Talent' ? 'Book Talent' : 'Learn More'}</button>
        <button onClick={() => openShare('post', post)} className='px-3 py-2 rounded-xl border flex gap-2 items-center hover:bg-zinc-50'><Share2 className='w-4 h-4' />Share</button>
      </div>
    </motion.div>
  );

  const navItems = [
    ['home', 'Home'],
    ['marketplace', 'Market'],
    ['support', 'Support'],
    ['events', 'Events'],
    ['post', 'Post'],
    ['partners', 'Ads'],
    ['saved', 'Saved'],
    ['account', 'Account'],
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 text-zinc-900'>
      <header className='sticky top-0 z-30 bg-white/90 backdrop-blur border-b px-4 md:px-8 py-4'>
        <div className='max-w-[1400px] mx-auto flex flex-wrap gap-4 items-start justify-between'>
          <div>
            <div className='text-3xl font-black tracking-tight'>{APP_NAME}</div>
            <div className='text-green-700 font-semibold'>{MARKETS[market]}</div>
            <div className='text-sm text-zinc-500'>Neighbors helping neighbors, selling to neighbors.</div>
            <div className='text-xs text-zinc-400 mt-1'>Near you: {selectedParish === 'All' ? 'All locations' : selectedParish}</div>
            <div className='text-[11px] mt-1 text-zinc-400'>{isLive ? 'Live Supabase mode' : 'Preview mode'}</div>
          </div>
          <div className='flex gap-2 items-center flex-wrap'>
            <select value={market} onChange={(e) => setMarket(e.target.value)} className='border rounded-xl px-3 py-2 bg-white'>
              <option value='JA'>Jamaica</option>
              <option value='UK'>UK</option>
              <option value='BB'>Barbados</option>
              <option value='LA'>Latin America</option>
              <option value='AF'>Africa</option>
              <option value='WW'>Worldwide</option>
            </select>
            <button onClick={() => { setTab('account'); setShowSignup(true); }} className='px-4 py-2 rounded-xl border hover:bg-zinc-100'>Sign In</button>
            <button onClick={() => { setTab('account'); setShowSignup(true); }} className='px-4 py-2 rounded-xl bg-green-700 text-white hover:bg-green-800'>Create Free Account</button>
          </div>
        </div>
      </header>

      <PromoRibbon
        promo={currentPromo}
        onOpen={(promo) => {
          if (promo.kind === 'event') setTab('events');
          else setDetailCard(promo.payload);
        }}
      />

      <section className='px-4 md:px-8 py-8 md:py-10'>
        <div className='max-w-[1400px] mx-auto rounded-[30px] overflow-hidden bg-gradient-to-r from-green-700 via-yellow-500 to-black text-white shadow-lg'>
          <div className='px-6 md:px-10 py-10 md:py-12'>
            <h1 className='text-3xl md:text-5xl font-black max-w-4xl leading-tight'>Neighborhood marketplace, food support, local talent, donations, events, and community connection.</h1>
            <p className='mt-3 max-w-2xl text-white/90 text-base md:text-lg'>Buy, sell, donate, share events and help neighbors in one ecosystem.</p>
            <div className='mt-6 flex gap-3 flex-wrap'>
              <button onClick={() => setTab('marketplace')} className='px-4 py-3 rounded-xl bg-white text-black font-semibold'>Explore Marketplace</button>
              <button onClick={() => { setTab('support'); setSupportMode('all'); }} className='px-4 py-3 rounded-xl border border-white/70 font-semibold'>Food & Support</button>
              <button onClick={() => setTab('post')} className='px-4 py-3 rounded-xl border border-white/70 font-semibold'>Post to Naborhood</button>
            </div>
          </div>
        </div>
      </section>

      <nav className='px-4 md:px-8 pb-2'>
        <div className='max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2'>
          {navItems.map(([t, text]) => (
            <button key={t} onClick={() => setTab(t)} className={`w-full px-3 py-2 rounded-full border text-sm text-center ${tab === t ? 'bg-black text-white border-black' : 'bg-white hover:bg-zinc-50'}`}>
              {text}
            </button>
          ))}
        </div>
      </nav>

      <main className='p-4 md:p-8 max-w-[1400px] mx-auto overflow-x-hidden'>
        <div className='mb-5 grid gap-3'>
          <div className='flex flex-wrap gap-3 items-center'>
            <select value={selectedParish} onChange={(e) => setSelectedParish(e.target.value)} className='border rounded-2xl px-4 py-3 bg-white'>
              {parishOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className='relative min-w-[260px] flex-1 max-w-xl'>
              <Search className='w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400' />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search food, services, donations, talent...' className='border rounded-2xl pl-11 pr-4 py-3 bg-white w-full' />
            </div>
            <button onClick={() => setMapMode(!mapMode)} className='border rounded-2xl px-4 py-3 bg-white flex items-center gap-2'><Navigation className='w-4 h-4' />{mapMode ? 'List View' : 'Map View'}</button>
            <button onClick={() => setAlertsOn(!alertsOn)} className={`border rounded-2xl px-4 py-3 flex items-center gap-2 ${alertsOn ? 'bg-green-700 text-white' : 'bg-white'}`}><Bell className='w-4 h-4' />{alertsOn ? 'Alerts On' : 'Alerts Off'}</button>
            {isCreatorAdmin && adminMode ? (
              <button onClick={() => setShowExamples(!showExamples)} className={`border rounded-2xl px-4 py-3 flex items-center gap-2 ${showExamples ? 'bg-amber-100 text-zinc-900' : 'bg-white'}`}>
                <Gift className='w-4 h-4' />{showExamples ? 'Examples On' : 'Examples Off'}
              </button>
            ) : null}
          </div>
        </div>

        {error ? <div className='mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>{error}</div> : null}
        {loading ? <div className='rounded-[24px] border bg-white p-10 flex items-center justify-center gap-3 text-zinc-600'><Loader2 className='w-5 h-5 animate-spin' /><span>Loading app data…</span></div> : null}

        {!loading && tab === 'home' && (
          <div className='space-y-7'>
            <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
              <KpiCard title='Active Listings' value={displayPosts.length} />
              <KpiCard title='Food Support' value={supportPosts.length} />
              <KpiCard title='Local Talent' value={displayPosts.filter((p) => p.type === 'Talent').length} />
              <KpiCard title='Events Nearby' value={displayEvents.length} />
            </div>
            <div className='grid xl:grid-cols-[1.35fr_.65fr] gap-6'>
              <div>
                <div className='flex items-center justify-between gap-3 mb-5'>
                  <h2 className='text-3xl font-black'>Featured in Naborly</h2>
                  <button onClick={() => setTab('marketplace')} className='text-sm font-semibold text-green-700'>View all</button>
                </div>
                <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visiblePosts.map(renderPostCard)}</div>
              </div>
              <div className='space-y-4'>
                <div className='bg-white rounded-[24px] border shadow-sm p-6'>
                  <h3 className='font-black text-2xl'>Quick Access</h3>
                  <div className='mt-4 grid gap-3'>
                    <button onClick={() => { setTab('support'); setSupportMode('meals'); }} className='rounded-2xl border p-4 text-left hover:bg-zinc-50'>
                      <div className='font-semibold flex items-center gap-2'><UtensilsCrossed className='w-4 h-4' />Free Meals & Services</div>
                      <div className='text-sm text-zinc-600'>Jump straight to free food and support listings.</div>
                    </button>
                    <button onClick={() => { setTab('support'); setSupportMode('med'); }} className='rounded-2xl border p-4 text-left hover:bg-zinc-50'>
                      <div className='font-semibold flex items-center gap-2'><Pill className='w-4 h-4' />Med Help</div>
                      <div className='text-sm text-zinc-600'>Open the support area filtered for medication and pharmacy help.</div>
                    </button>
                    <button onClick={() => setTab('events')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50'>
                      <div className='font-semibold'>Events in the Naborhood</div>
                      <div className='text-sm text-zinc-600'>Find nearby events, RSVP, and buy tickets.</div>
                    </button>
                    <button onClick={() => setTab('post')} className='rounded-2xl border p-4 text-left hover:bg-zinc-50'>
                      <div className='font-semibold'>Post to Naborhood</div>
                      <div className='text-sm text-zinc-600'>Sell, donate, promote, or share a service.</div>
                    </button>
                  </div>
                </div>

                <div className='bg-white rounded-[24px] border shadow-sm p-6'>
                  <h3 className='font-black text-2xl'>Share & Earn Elite</h3>
                  <p className='mt-2 text-sm text-zinc-600'>Earn Nabor Points when friends join, post, buy, sell, or reserve through your invite.</p>
                  <div className='mt-4 grid gap-3'>
                    <div className='rounded-2xl bg-amber-50 border p-4'>
                      <div className='text-xs text-zinc-500'>Referral Code</div>
                      <div className='font-black text-lg'>{DEFAULT_REFERRAL}</div>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                      <div className='rounded-2xl border p-3 text-center'><div className='text-xs text-zinc-500'>Points</div><div className='font-black text-xl'>1,250</div></div>
                      <div className='rounded-2xl border p-3 text-center'><div className='text-xs text-zinc-500'>Referrals</div><div className='font-black text-xl'>18</div></div>
                      <div className='rounded-2xl border p-3 text-center'><div className='text-xs text-zinc-500'>Payout</div><div className='font-black text-xl'>{market === 'JA' ? 'JMD $42' : market === 'UK' ? 'GBP £42' : 'USD $42'}</div></div>
                    </div>
                    <button
                      onClick={() => openShare('home', { title: 'Naborly', id: 'home' })}
                      className='rounded-2xl border p-3 flex items-center gap-2 text-left'
                    >
                      <QrCode className='w-4 h-4' />QR codes, WhatsApp, social, and flyer links
                    </button>
                    <a href={shareWhatsApp(`Join me on ${APP_NAME} with my invite code ${DEFAULT_REFERRAL} ${buildDeepLink({ ref: DEFAULT_REFERRAL })}`)} target='_blank' rel='noreferrer' className='rounded-2xl border p-3 flex items-center gap-2'><MessageCircle className='w-4 h-4' />Share via WhatsApp</a>
                    <button onClick={() => openShare('home', { title: 'Naborly Referral', id: 'referral' })} className='rounded-2xl border p-3 flex items-center gap-2'><Share2 className='w-4 h-4' />Open social share tools</button>
                    <button className='rounded-2xl bg-green-700 text-white p-3 font-semibold'>Cash Out Rewards</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && tab === 'marketplace' && (
          <div>
            <div className='flex items-center justify-between gap-4 mb-5 flex-wrap'>
              <h2 className='text-3xl font-black'>Marketplace</h2>
              <div className='text-sm text-zinc-600'>Clean cards. Full details open in the next step.</div>
            </div>
            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visiblePosts.map(renderPostCard)}</div>
          </div>
        )}

        {!loading && tab === 'support' && (
          <div className='space-y-6'>
            <div className='flex gap-2 flex-wrap'>
              <button onClick={() => setSupportMode('all')} className={`rounded-full border px-4 py-2 ${supportMode === 'all' ? 'bg-black text-white border-black' : 'bg-white'}`}>All Support</button>
              <button onClick={() => setSupportMode('meals')} className={`rounded-full border px-4 py-2 ${supportMode === 'meals' ? 'bg-black text-white border-black' : 'bg-white'}`}>Free Meals & Services</button>
              <button onClick={() => setSupportMode('med')} className={`rounded-full border px-4 py-2 ${supportMode === 'med' ? 'bg-black text-white border-black' : 'bg-white'}`}>Med Help</button>
            </div>
            <div>
              <h2 className='text-3xl font-black mb-4'>Food & Support</h2>
              <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{visiblePosts.filter((p) => p.free || p.type === 'Free Support').map(renderPostCard)}</div>
            </div>
            <div className='grid md:grid-cols-2 gap-4'>
              <SupportQuickCard
                icon={UtensilsCrossed}
                title='Free Meals & Services'
                body='Opens the support listings filtered to free food, meal donations, and community help.'
                onClick={() => setSupportMode('meals')}
              />
              <SupportQuickCard
                icon={Pill}
                title='Med Help'
                body='Opens the support listings filtered for medication, pharmacy, and prescription assistance.'
                onClick={() => setSupportMode('med')}
              />
            </div>
          </div>
        )}

        {!loading && tab === 'events' && (
          <div className='space-y-6'>
            <div className='flex items-start justify-between gap-4 flex-wrap'>
              <div>
                <h2 className='text-3xl font-black'>Events in the Naborhood</h2>
                <div className='text-sm text-zinc-600 mt-1'>Weekend picks, RSVP, direct host WhatsApp links, and ticket sales.</div>
                <div className='mt-2 rounded-2xl bg-gradient-to-r from-black to-zinc-700 text-white p-4 text-sm'>Featured events • Ticket sales • Promote events • Naborly marketplace operator mode</div>
              </div>
              <div className='flex gap-2 flex-wrap'>
                <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className='rounded-2xl border px-4 py-3 bg-white'>
                  <option>All</option>
                  {(PARISH_MAP[market] || []).map((p) => <option key={p}>{p}</option>)}
                </select>
                <button onClick={() => setDetailCard({ id: 'promo-plan', title: 'Promote Your Event', type: 'Event Promo', description: 'Feature your event across Naborly.', free: false, price: 'JMD 2,000', qtyLeft: 1, qtyTotal: 1, vendor: 'Naborly Marketplace', whatsapp: '18765559999', tracking: 'Confirmed', loc: selectedParish === 'All' ? 'All parishes' : selectedParish })} className='rounded-2xl bg-black text-white px-4 py-3'>Promote Event</button>
              </div>
            </div>
            <div className='grid xl:grid-cols-[1.15fr_.85fr] gap-4'>
              <div>
                <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {visibleEvents.map((ev) => (
                    <div key={ev.id} className='bg-white rounded-[24px] p-5 border shadow-sm'>
                      <div className='flex items-start justify-between gap-3'>
                        <span className='text-xs font-bold bg-amber-100 px-2.5 py-1 rounded-full'>{ev.featured ? 'Featured Event' : 'Event'}</span>
                        <button onClick={() => toggleSavedEvent(ev.id)} className='rounded-full p-1 hover:bg-zinc-100'><Heart className={`w-5 h-5 ${savedEventIds.includes(ev.id) ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} /></button>
                      </div>
                      <h3 className='font-black text-xl mt-3'>{ev.title}</h3>
                      <div className='mt-2 text-sm text-zinc-600 flex items-center gap-2'><MapPin className='w-4 h-4' />{ev.loc}</div>
                      <div className='mt-1 text-sm text-zinc-600'>{ev.date}</div>
                      <div className='mt-1 text-sm font-semibold'>{ev.price}</div>
                      <div className='mt-3 text-sm'>{ev.description}</div>
                      <div className='mt-4 flex gap-2 flex-wrap'>
                        <a href={safeWhatsapp(ev.whatsapp, ev.title, selectedParish)} target='_blank' rel='noreferrer' className='px-3 py-2 rounded-xl border flex gap-2 items-center hover:bg-zinc-50'><MessageCircle className='w-4 h-4' />WhatsApp Host</a>
                        <button onClick={() => setTab('account')} className='px-3 py-2 rounded-xl bg-green-700 text-white'>RSVP</button>
                        <button onClick={() => setDetailCard({ id: `ticket-${ev.id}`, title: `${ev.title} Tickets`, type: 'Event Ticket', description: ev.description, free: ev.price === 'Free', price: ev.price, qtyLeft: 50, qtyTotal: 50, vendor: ev.host, whatsapp: ev.whatsapp, tracking: 'Confirmed', loc: ev.loc })} className='px-3 py-2 rounded-xl bg-black text-white'>Buy Ticket</button>
                        <button onClick={() => openShare('event', ev)} className='px-3 py-2 rounded-xl border flex items-center gap-1'><Share2 className='w-4 h-4' />Share</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='space-y-4'>
                <div className='bg-white rounded-[24px] p-5 border shadow-sm'>
                  <div className='font-black text-xl'>Naborly as Marketplace Operator</div>
                  <p className='mt-2 text-sm text-zinc-600'>You are the marketplace. Naborly can host event traffic, vendor booths, promoted listings, and ticketing as the platform owner.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && tab === 'post' && (
          <div className='max-w-3xl bg-white p-6 rounded-[28px] border shadow-sm space-y-4'>
            <h2 className='text-3xl font-black'>Post to Naborhood</h2>
            <div className='grid md:grid-cols-2 gap-3'>
              <select className='w-full border rounded-2xl p-3'>{(PARISH_MAP[market] || []).map((p) => <option key={p}>{p}</option>)}</select>
              <input className='w-full border rounded-2xl p-3' placeholder='Title' />
              <input className='w-full border rounded-2xl p-3' placeholder='Landmark / near location' />
              <input className='w-full border rounded-2xl p-3' placeholder='Total quantity available' />
              <input className='w-full border rounded-2xl p-3' placeholder='Quantity left' />
            </div>
            <textarea className='w-full border rounded-2xl p-3 min-h-[120px]' placeholder='Describe item or service' />
            <label className='w-full border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-zinc-50'>
              <Upload className='w-5 h-5' />
              <span>Upload product or service image</span>
              <input type='file' className='hidden' />
            </label>
            <button className='px-4 py-3 rounded-2xl bg-green-700 text-white flex gap-2 items-center font-semibold hover:bg-green-800'><PlusCircle className='w-4 h-4' />Post Now</button>
          </div>
        )}

        {!loading && tab === 'partners' && (
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='bg-white p-6 rounded-[24px] border shadow-sm'>
              <div className='font-black text-xl'>Featured Vendor</div>
              <div className='mt-2 text-zinc-600'>Promote products & services</div>
              <button onClick={() => setDetailCard({ id: 'plan-vendor', title: 'Featured Vendor Plan', type: 'Partner Plan', description: 'Promote your products and services to more neighborhoods.', free: false, price: 'JMD 3,000 / month', qtyLeft: 1, qtyTotal: 1, vendor: 'Naborly Marketplace', whatsapp: '18765559999', tracking: 'Confirmed', loc: 'All Markets' })} className='mt-4 px-3 py-2 rounded-xl bg-black text-white'>Subscribe</button>
            </div>
            <div className='bg-white p-6 rounded-[24px] border shadow-sm'>
              <div className='font-black text-xl'>Promote Event</div>
              <div className='mt-2 text-zinc-600'>Reach local neighborhoods</div>
              <button onClick={() => setDetailCard({ id: 'plan-event', title: 'Promote Event', type: 'Ad Plan', description: 'Advertise your event placement and reach more people.', free: false, price: 'JMD 2,000', qtyLeft: 1, qtyTotal: 1, vendor: 'Naborly Marketplace', whatsapp: '18765559999', tracking: 'Confirmed', loc: 'All Markets' })} className='mt-4 px-3 py-2 rounded-xl bg-black text-white'>Pay</button>
            </div>
            <div className='bg-white p-6 rounded-[24px] border shadow-sm'>
              <div className='font-black text-xl'>Business Pro</div>
              <div className='mt-2 text-zinc-600'>Top placement + ads</div>
              <button onClick={() => setDetailCard({ id: 'plan-business', title: 'Business Pro', type: 'Partner Plan', description: 'Top placement, ads, and more visibility.', free: false, price: 'JMD 10,000 / month', qtyLeft: 1, qtyTotal: 1, vendor: 'Naborly Marketplace', whatsapp: '18765559999', tracking: 'Confirmed', loc: 'All Markets' })} className='mt-4 px-3 py-2 rounded-xl bg-black text-white'>Upgrade</button>
            </div>
          </div>
        )}

        {!loading && tab === 'saved' && (
          <div className='bg-white p-6 rounded-[24px] border shadow-sm'>
            <h2 className='text-3xl font-black'>Saved & Followed</h2>
            <p className='mt-2 text-zinc-600'>Your hearted posts appear here.</p>
            <div className='mt-5 grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{favoritePosts.length ? favoritePosts.map(renderPostCard) : <p>No favorites yet.</p>}</div>
          </div>
        )}

        {!loading && tab === 'account' && (
          <div className='grid xl:grid-cols-[1fr_.9fr] gap-4 items-start'>
            <div className='bg-white p-6 rounded-[28px] border shadow-sm'>
              <User className='mb-2' />
              <h2 className='text-3xl font-black'>Account</h2>
              <p className='mt-2 text-zinc-600'>Create account, sign in, manage favorites, and share Naborly.</p>
              <div className='mt-5 grid gap-3'>
                <button onClick={() => setShowSignup(true)} className='rounded-2xl bg-green-700 text-white px-4 py-3 font-semibold hover:bg-green-800'>Open Signup Form</button>
                <button className='rounded-2xl border px-4 py-3 font-semibold hover:bg-zinc-50'>Sign Out</button>
                {isCreatorAdmin ? (
                  <button onClick={() => setAdminMode(!adminMode)} className={`rounded-2xl border px-4 py-3 font-semibold ${adminMode ? 'bg-black text-white border-black' : 'hover:bg-zinc-50'}`}>
                    {adminMode ? 'Admin Mode On' : 'Admin Mode Off'}
                  </button>
                ) : null}
                {isCreatorAdmin && adminMode ? (
                  <button onClick={() => setShowExamples(!showExamples)} className='rounded-2xl border px-4 py-3 font-semibold hover:bg-zinc-50'>
                    {showExamples ? 'Hide Example Content' : 'Show Example Content'}
                  </button>
                ) : null}
              </div>
            </div>

            <div className='bg-white p-6 rounded-[28px] border shadow-sm'>
              <CalendarDays className='mb-2' />
              <h2 className='text-2xl font-black'>Tracking</h2>
              <p className='mt-2 text-zinc-600'>Live progress for your latest order or reservation.</p>
              <div className='mt-5 rounded-2xl border bg-amber-50 p-4'>
                <div className='text-xs text-zinc-500'>Current item</div>
                <div className='font-black text-lg mt-1'>{trackingView.title}</div>
                <div className='text-sm text-zinc-600 mt-1'>{trackingView.loc}</div>
              </div>
              <div className='mt-6'>
                <div className='flex justify-between text-xs text-zinc-500 mb-2'><span>Reserved</span><span>Delivered</span></div>
                <div className='relative h-3 rounded-full bg-zinc-200 overflow-hidden'>
                  <div className='absolute inset-y-0 left-0 bg-green-600 rounded-full transition-all duration-500' style={{ width: `${((trackingIndex(trackingView.tracking) + 1) / TRACKING_STEPS.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} market={market} />
      <CardDetailModal
        card={detailCard}
        onClose={() => setDetailCard(null)}
        onReserve={(card) => { setTrackingView(card); setTab('account'); setDetailCard(null); }}
        market={market}
      />
      <ShareModal
        open={shareState.open}
        onClose={() => setShareState({ open: false, title: '', url: '', whatsapp: '' })}
        title={shareState.title}
        targetUrl={shareState.url}
        whatsappMessage={shareState.whatsapp}
      />
    </div>
  );
}
