import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  session: 'naborly_session',
  listings: 'naborly_listings',
  reports: 'naborly_reports',
  favorites: 'naborly_favorites',
};

const seedListings = [
  {
    id: 'l1',
    title: 'Fresh mangoes and bananas',
    type: 'Food',
    mode: 'For Sale',
    price: '15',
    neighborhood: 'Kingston 8',
    contact: 'WhatsApp 876-555-0101',
    description: 'Bagged fruit available for pickup this afternoon.',
    image: '',
    seller: 'Marcia',
    approved: true,
    createdAt: '2026-04-16T08:00:00.000Z',
  },
  {
    id: 'l2',
    title: 'Breadfruit giveaway',
    type: 'Giveaway',
    mode: 'Free',
    price: '0',
    neighborhood: 'Montego Bay',
    contact: 'Text 876-555-0130',
    description: 'First come first served. Ideal for families.',
    image: '',
    seller: 'Community Pantry',
    approved: true,
    createdAt: '2026-04-15T17:30:00.000Z',
  },
  {
    id: 'l3',
    title: 'Electrician available this weekend',
    type: 'Skilled Worker',
    mode: 'Service',
    price: 'Call',
    neighborhood: 'Spanish Town',
    contact: 'Call 876-555-0172',
    description: 'Home repairs, wiring, and troubleshooting.',
    image: '',
    seller: 'Devon Repairs',
    approved: true,
    createdAt: '2026-04-14T13:20:00.000Z',
  },
];

const seedReports = [];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function App() {
  const [session, setSession] = useState(() => readStorage(STORAGE_KEYS.session, null));
  const [listings, setListings] = useState(() => readStorage(STORAGE_KEYS.listings, seedListings));
  const [reports, setReports] = useState(() => readStorage(STORAGE_KEYS.reports, seedReports));
  const [favorites, setFavorites] = useState(() => readStorage(STORAGE_KEYS.favorites, {}));
  const [tab, setTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterNeighborhood, setFilterNeighborhood] = useState('All');
  const [postForm, setPostForm] = useState({
    title: '',
    type: 'Food',
    mode: 'For Sale',
    price: '',
    neighborhood: '',
    contact: '',
    seller: '',
    description: '',
    image: '',
  });
  const [authForm, setAuthForm] = useState({ name: '', email: '', neighborhood: '', role: 'buyer' });
  const [notice, setNotice] = useState('');

  useEffect(() => writeStorage(STORAGE_KEYS.session, session), [session]);
  useEffect(() => writeStorage(STORAGE_KEYS.listings, listings), [listings]);
  useEffect(() => writeStorage(STORAGE_KEYS.reports, reports), [reports]);
  useEffect(() => writeStorage(STORAGE_KEYS.favorites, favorites), [favorites]);

  useEffect(() => {
    const timer = notice ? setTimeout(() => setNotice(''), 2400) : null;
    return () => timer && clearTimeout(timer);
  }, [notice]);

  const visibleListings = useMemo(() => {
    return listings
      .filter((item) => item.approved)
      .filter((item) => (filterType === 'All' ? true : item.type === filterType))
      .filter((item) => (filterNeighborhood === 'All' ? true : item.neighborhood === filterNeighborhood))
      .filter((item) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        return [item.title, item.description, item.neighborhood, item.seller, item.type]
          .join(' ')
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [listings, filterType, filterNeighborhood, search]);

  const neighborhoods = ['All', ...new Set(listings.map((item) => item.neighborhood).filter(Boolean))];
  const types = ['All', 'Food', 'Giveaway', 'Skilled Worker', 'Event', 'Household'];
  const userFavorites = session ? favorites[session.email] || [] : [];
  const moderationQueue = listings.filter((item) => !item.approved);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!authForm.name || !authForm.email) return setNotice('Enter your name and email to continue.');
    const nextSession = { ...authForm, isAdmin: authForm.email.toLowerCase().includes('admin') };
    setSession(nextSession);
    setNotice(`Welcome, ${authForm.name}.`);
  };

  const toggleFavorite = (listingId) => {
    if (!session) return setNotice('Sign in to save listings.');
    const current = favorites[session.email] || [];
    const next = current.includes(listingId)
      ? current.filter((id) => id !== listingId)
      : [...current, listingId];
    setFavorites({ ...favorites, [session.email]: next });
  };

  const submitListing = (e) => {
    e.preventDefault();
    if (!session) return setNotice('Please sign in before posting.');
    if (!postForm.title || !postForm.neighborhood || !postForm.contact) {
      return setNotice('Add a title, neighborhood, and contact before posting.');
    }
    const newItem = {
      ...postForm,
      id: `l${Date.now()}`,
      seller: postForm.seller || session.name,
      approved: false,
      createdAt: new Date().toISOString(),
    };
    setListings([newItem, ...listings]);
    setPostForm({
      title: '', type: 'Food', mode: 'For Sale', price: '', neighborhood: '', contact: '', seller: '', description: '', image: '',
    });
    setTab('alerts');
    setNotice('Listing submitted for admin review.');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPostForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submitReport = (listing) => {
    if (!session) return setNotice('Sign in to report a listing.');
    const report = {
      id: `r${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      reporter: session.email,
      createdAt: new Date().toISOString(),
      reason: 'Flagged by user for review',
    };
    setReports([report, ...reports]);
    setNotice('Report sent to admin.');
  };

  const approveListing = (listingId) => {
    setListings(listings.map((item) => (item.id === listingId ? { ...item, approved: true } : item)));
    setNotice('Listing approved.');
  };

  const removeListing = (listingId) => {
    setListings(listings.filter((item) => item.id !== listingId));
    setNotice('Listing removed.');
  };

  const savedListings = visibleListings.filter((item) => userFavorites.includes(item.id));

  if (!session) {
    return (
      <div className="shell auth-shell">
        <div className="hero-card">
          <div className="badge">Real app starter</div>
          <h1>Naborly</h1>
          <p className="lead">A neighborhood marketplace for food, giveaways, skilled workers, and local events.</p>
          <div className="grid two">
            <div className="panel soft">
              <h3>Included now</h3>
              <ul>
                <li>Sign-in flow</li>
                <li>Neighborhood feed</li>
                <li>Favorites</li>
                <li>Image upload UI</li>
                <li>Report listing</li>
                <li>Admin moderation</li>
                <li>Mock backend-ready data model</li>
              </ul>
            </div>
            <form className="panel" onSubmit={handleLogin}>
              <h3>Enter the app</h3>
              <label>Name<input value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} /></label>
              <label>Email<input type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} /></label>
              <label>Neighborhood<input value={authForm.neighborhood} onChange={(e) => setAuthForm({ ...authForm, neighborhood: e.target.value })} /></label>
              <label>Role
                <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}>
                  <option value="buyer">Buyer / neighbor</option>
                  <option value="seller">Seller / vendor</option>
                  <option value="helper">Community helper</option>
                  <option value="admin">Admin tester</option>
                </select>
              </label>
              <button className="primary" type="submit">Continue</button>
              <p className="small">Use an email containing “admin” to see moderation tools instantly in this starter.</p>
            </form>
          </div>
          {notice && <div className="toast">{notice}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <div className="badge">Neighborhood commerce</div>
          <h1>Naborly</h1>
          <p className="muted">Signed in as {session.name} · {session.neighborhood || 'All neighborhoods'}</p>
        </div>
        <div className="top-actions">
          <button onClick={() => setTab('post')}>New listing</button>
          <button onClick={() => setSession(null)}>Sign out</button>
        </div>
      </header>

      <nav className="tabs">
        {[
          ['browse', 'Browse'],
          ['post', 'Post'],
          ['saved', `Saved (${userFavorites.length})`],
          ['alerts', `Alerts (${moderationQueue.length + reports.length})`],
          ...(session.isAdmin || session.role === 'admin' ? [['admin', 'Admin']] : []),
        ].map(([key, label]) => (
          <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>
        ))}
      </nav>

      {notice && <div className="toast">{notice}</div>}

      {tab === 'browse' && (
        <>
          <section className="panel filter-bar">
            <input placeholder="Search food, events, workers, giveaways..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>{types.map((t) => <option key={t}>{t}</option>)}</select>
            <select value={filterNeighborhood} onChange={(e) => setFilterNeighborhood(e.target.value)}>{neighborhoods.map((n) => <option key={n}>{n}</option>)}</select>
          </section>
          <section className="grid listing-grid">
            {visibleListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                saved={userFavorites.includes(listing.id)}
                onSave={() => toggleFavorite(listing.id)}
                onReport={() => submitReport(listing)}
              />
            ))}
            {!visibleListings.length && <div className="panel">No listings match your search yet.</div>}
          </section>
        </>
      )}

      {tab === 'post' && (
        <form className="panel form-grid" onSubmit={submitListing}>
          <h2>Create a listing</h2>
          <div className="grid two">
            <label>Title<input value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} /></label>
            <label>Neighborhood<input value={postForm.neighborhood} onChange={(e) => setPostForm({ ...postForm, neighborhood: e.target.value })} /></label>
            <label>Type
              <select value={postForm.type} onChange={(e) => setPostForm({ ...postForm, type: e.target.value })}>
                <option>Food</option><option>Giveaway</option><option>Skilled Worker</option><option>Event</option><option>Household</option>
              </select>
            </label>
            <label>Mode
              <select value={postForm.mode} onChange={(e) => setPostForm({ ...postForm, mode: e.target.value })}>
                <option>For Sale</option><option>Free</option><option>Service</option><option>Meetup</option>
              </select>
            </label>
            <label>Price<input value={postForm.price} onChange={(e) => setPostForm({ ...postForm, price: e.target.value })} placeholder="15 / Free / Call" /></label>
            <label>Contact<input value={postForm.contact} onChange={(e) => setPostForm({ ...postForm, contact: e.target.value })} placeholder="Phone, WhatsApp, or pickup info" /></label>
            <label>Seller name<input value={postForm.seller} onChange={(e) => setPostForm({ ...postForm, seller: e.target.value })} /></label>
            <label>Image
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          <label>Description<textarea rows="4" value={postForm.description} onChange={(e) => setPostForm({ ...postForm, description: e.target.value })} /></label>
          {postForm.image && <img className="preview" src={postForm.image} alt="preview" />}
          <button className="primary" type="submit">Submit for review</button>
        </form>
      )}

      {tab === 'saved' && (
        <section className="grid listing-grid">
          {savedListings.length ? savedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              saved={true}
              onSave={() => toggleFavorite(listing.id)}
              onReport={() => submitReport(listing)}
            />
          )) : <div className="panel">No saved listings yet.</div>}
        </section>
      )}

      {tab === 'alerts' && (
        <section className="grid two">
          <div className="panel">
            <h3>Pending approvals</h3>
            {moderationQueue.length ? moderationQueue.map((item) => (
              <div className="alert-item" key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.neighborhood}</span>
                <span>Submitted by {item.seller}</span>
              </div>
            )) : <p className="muted">No pending listings.</p>}
          </div>
          <div className="panel">
            <h3>Recent reports</h3>
            {reports.length ? reports.map((item) => (
              <div className="alert-item" key={item.id}>
                <strong>{item.listingTitle}</strong>
                <span>{item.reason}</span>
                <span>{item.reporter}</span>
              </div>
            )) : <p className="muted">No reports submitted.</p>}
          </div>
        </section>
      )}

      {tab === 'admin' && (session.isAdmin || session.role === 'admin') && (
        <section className="grid two">
          <div className="panel">
            <h2>Moderation queue</h2>
            {moderationQueue.length ? moderationQueue.map((item) => (
              <div className="admin-card" key={item.id}>
                <h4>{item.title}</h4>
                <p>{item.description || 'No description provided.'}</p>
                <div className="meta-row">
                  <span>{item.neighborhood}</span>
                  <span>{item.type}</span>
                </div>
                <div className="admin-actions">
                  <button className="primary" onClick={() => approveListing(item.id)}>Approve</button>
                  <button onClick={() => removeListing(item.id)}>Reject</button>
                </div>
              </div>
            )) : <p className="muted">No listings waiting for approval.</p>}
          </div>
          <div className="panel">
            <h2>Backend handoff</h2>
            <p className="muted">Ready to connect to Supabase, Firebase, or a custom API.</p>
            <pre>{`tables:
- users(id, name, email, neighborhood, role)
- listings(id, title, type, mode, price, neighborhood, contact, description, image_url, seller_id, approved)
- favorites(id, user_id, listing_id)
- reports(id, user_id, listing_id, reason)
- messages(id, sender_id, receiver_id, listing_id, body)

next integrations:
1. auth provider
2. storage bucket
3. moderation rules
4. geolocation + map pins
5. WhatsApp / SMS links`}</pre>
          </div>
        </section>
      )}
    </div>
  );
}

function ListingCard({ listing, saved, onSave, onReport }) {
  return (
    <article className="panel listing-card">
      <div className="card-top">
        <div>
          <div className="badge alt">{listing.type}</div>
          <h3>{listing.title}</h3>
        </div>
        <button className={saved ? 'saved' : ''} onClick={onSave}>{saved ? '★ Saved' : '☆ Save'}</button>
      </div>
      {listing.image ? <img className="listing-image" src={listing.image} alt={listing.title} /> : <div className="listing-image placeholder">Image upload ready</div>}
      <p>{listing.description}</p>
      <div className="meta-row"><span>{listing.mode}</span><span>{listing.neighborhood}</span><span>{listing.price === '0' ? 'Free' : listing.price}</span></div>
      <div className="meta-row"><strong>{listing.seller}</strong><span>{listing.contact}</span></div>
      <div className="card-actions">
        <button className="primary">Contact seller</button>
        <button onClick={onReport}>Report</button>
      </div>
    </article>
  );
}

export default App;
