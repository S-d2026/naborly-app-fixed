import { useMemo, useState } from 'react'

const neighborhoodData = [
  { name: 'Kingston', vibe: 'Fast-moving city listings', count: 42 },
  { name: 'Montego Bay', vibe: 'Food drops and beach-town trades', count: 18 },
  { name: 'Spanish Town', vibe: 'Family needs and local services', count: 26 },
  { name: 'Mandeville', vibe: 'Fresh produce and home support', count: 15 },
]

const seedListings = [
  {
    id: 1,
    type: 'Food for Sale',
    title: 'Fresh ackee, breadfruit, and callaloo bundle',
    price: 'JMD 2,200',
    neighborhood: 'Kingston',
    pickup: 'Half-Way Tree pickup at 5:30 PM',
    contact: 'WhatsApp seller',
    tag: 'Produce',
  },
  {
    id: 2,
    type: 'Giveaway',
    title: 'Free mango bag for same-day pickup',
    price: 'Free',
    neighborhood: 'Spanish Town',
    pickup: 'Pickup near Angels',
    contact: 'Message donor',
    tag: 'Food Help',
  },
  {
    id: 3,
    type: 'Skilled Worker',
    title: 'Plumber available for leaks and pipe repair',
    price: 'From JMD 6,000',
    neighborhood: 'Montego Bay',
    pickup: 'Mobile service',
    contact: 'Book worker',
    tag: 'Services',
  },
  {
    id: 4,
    type: 'Event',
    title: 'Community food fair and small business pop-up',
    price: 'Free entry',
    neighborhood: 'Mandeville',
    pickup: 'Saturday 2 PM',
    contact: 'View details',
    tag: 'Community',
  },
]

const tabOptions = ['All', 'Food for Sale', 'Giveaway', 'Skilled Worker', 'Event']

export default function App() {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All neighborhoods')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState([1, 4])
  const [signedIn, setSignedIn] = useState(false)
  const [currentView, setCurrentView] = useState('home')
  const [listings, setListings] = useState(seedListings)
  const [form, setForm] = useState({
    title: '',
    type: 'Food for Sale',
    price: '',
    neighborhood: 'Kingston',
    pickup: '',
  })

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const tabMatch = activeTab === 'All' || item.type === activeTab
      const areaMatch =
        selectedNeighborhood === 'All neighborhoods' || item.neighborhood === selectedNeighborhood
      const q = search.toLowerCase()
      const searchMatch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      return tabMatch && areaMatch && searchMatch
    })
  }, [activeTab, selectedNeighborhood, search, listings])

  function toggleFavorite(id) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function submitListing(e) {
    e.preventDefault()
    const newListing = {
      id: Date.now(),
      ...form,
      contact: 'Pending contact setup',
      tag: form.type === 'Skilled Worker' ? 'Services' : form.type === 'Event' ? 'Community' : 'Food',
    }
    setListings((prev) => [newListing, ...prev])
    setForm({ title: '', type: 'Food for Sale', price: '', neighborhood: 'Kingston', pickup: '' })
    setCurrentView('market')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-row">
            <div className="brand-badge">N</div>
            <div>
              <h1>Naborly</h1>
              <p>Food, workers, and community links in one neighborhood app.</p>
            </div>
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-btn" onClick={() => setCurrentView('post')}>Post listing</button>
          <button className="primary-btn" onClick={() => setSignedIn((s) => !s)}>
            {signedIn ? 'Signed in' : 'Sign in'}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="pill">Built for Jamaica communities</span>
          <h2>Find fresh food, trusted workers, giveaways, and local events near you.</h2>
          <p>
            A neighborhood-first marketplace where people can sell, share, meet up, and stay informed.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setCurrentView('market')}>Browse market</button>
            <button className="ghost-btn" onClick={() => setCurrentView('favorites')}>View favorites</button>
          </div>
        </div>
        <div className="hero-card">
          <h3>Today in your area</h3>
          <ul>
            <li>12 produce listings added this morning</li>
            <li>4 worker bookings available this afternoon</li>
            <li>2 community events this weekend</li>
          </ul>
          <div className="stat-grid">
            <div><strong>1,280+</strong><span>local users</span></div>
            <div><strong>87%</strong><span>same-day pickups</span></div>
            <div><strong>24</strong><span>active meet-up spots</span></div>
          </div>
        </div>
      </section>

      <nav className="main-nav">
        {[
          ['home', 'Home'],
          ['market', 'Marketplace'],
          ['post', 'Post'],
          ['favorites', 'Favorites'],
          ['admin', 'Admin'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={currentView === key ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {currentView === 'home' && (
        <>
          <section className="section">
            <div className="section-head">
              <h3>Browse by neighborhood</h3>
              <p>Tap into the communities with the most active listings right now.</p>
            </div>
            <div className="card-grid neighborhoods">
              {neighborhoodData.map((item) => (
                <button
                  key={item.name}
                  className="info-card"
                  onClick={() => {
                    setSelectedNeighborhood(item.name)
                    setCurrentView('market')
                  }}
                >
                  <strong>{item.name}</strong>
                  <span>{item.vibe}</span>
                  <small>{item.count} active posts</small>
                </button>
              ))}
            </div>
          </section>

          <section className="section two-col">
            <div className="panel">
              <h3>Why this version matches your app better</h3>
              <ul className="clean-list">
                <li>Neighborhood-first home screen</li>
                <li>Separate listing types for food, giveaways, workers, and events</li>
                <li>Favorites and posting flow built in</li>
                <li>Admin review section for moderation</li>
                <li>Cleaner Jamaica-focused marketplace branding</li>
              </ul>
            </div>
            <div className="panel soft">
              <h3>Next live upgrades</h3>
              <ul className="clean-list">
                <li>Real user login with Supabase</li>
                <li>Image upload storage</li>
                <li>WhatsApp click-to-contact</li>
                <li>Map meetup points</li>
                <li>Push alerts for urgent food drops</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {currentView === 'market' && (
        <section className="section">
          <div className="filters">
            <input
              className="search-input"
              placeholder="Search food, workers, events, or area"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={selectedNeighborhood} onChange={(e) => setSelectedNeighborhood(e.target.value)}>
              <option>All neighborhoods</option>
              {neighborhoodData.map((n) => <option key={n.name}>{n.name}</option>)}
            </select>
          </div>

          <div className="tabs">
            {tabOptions.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'tab active' : 'tab'}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="card-grid listings">
            {filtered.map((item) => (
              <article key={item.id} className="listing-card">
                <div className="listing-top">
                  <span className="pill alt">{item.type}</span>
                  <button className="icon-btn" onClick={() => toggleFavorite(item.id)}>
                    {favorites.includes(item.id) ? '★' : '☆'}
                  </button>
                </div>
                <h4>{item.title}</h4>
                <p className="price">{item.price}</p>
                <p>{item.neighborhood}</p>
                <p className="muted">{item.pickup}</p>
                <div className="listing-actions">
                  <button className="primary-btn small">{item.contact}</button>
                  <button className="ghost-btn small">Report</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {currentView === 'post' && (
        <section className="section two-col">
          <form className="panel" onSubmit={submitListing}>
            <h3>Create a listing</h3>
            <label>
              Title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label>
              Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Food for Sale</option>
                <option>Giveaway</option>
                <option>Skilled Worker</option>
                <option>Event</option>
              </select>
            </label>
            <label>
              Price or note
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </label>
            <label>
              Neighborhood
              <select value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}>
                {neighborhoodData.map((n) => <option key={n.name}>{n.name}</option>)}
              </select>
            </label>
            <label>
              Pickup, meeting point, or schedule
              <input value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} required />
            </label>
            <label>
              Upload photo
              <div className="upload-box">Tap to add photo preview area</div>
            </label>
            <button className="primary-btn" type="submit">Publish listing</button>
          </form>
          <div className="panel soft">
            <h3>Posting tips</h3>
            <ul className="clean-list">
              <li>Use a clear food or service title</li>
              <li>State exact pickup area and time</li>
              <li>Say if it is free, paid, or donation-based</li>
              <li>Add trusted meetup points later in the live version</li>
            </ul>
          </div>
        </section>
      )}

      {currentView === 'favorites' && (
        <section className="section">
          <div className="section-head">
            <h3>Saved favorites</h3>
            <p>Your starred listings stay here for quick access.</p>
          </div>
          <div className="card-grid listings">
            {listings.filter((item) => favorites.includes(item.id)).map((item) => (
              <article key={item.id} className="listing-card">
                <span className="pill alt">{item.type}</span>
                <h4>{item.title}</h4>
                <p className="price">{item.price}</p>
                <p>{item.neighborhood}</p>
                <p className="muted">{item.pickup}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {currentView === 'admin' && (
        <section className="section two-col">
          <div className="panel">
            <h3>Admin moderation queue</h3>
            <div className="moderation-item">
              <strong>Flagged listing</strong>
              <p>“Free mango bag for same-day pickup” was reported by 2 users.</p>
              <div className="listing-actions">
                <button className="ghost-btn small">Review</button>
                <button className="primary-btn small">Approve</button>
              </div>
            </div>
            <div className="moderation-item">
              <strong>New worker post</strong>
              <p>Verify phone number and service area before publishing to all users.</p>
              <div className="listing-actions">
                <button className="ghost-btn small">Hold</button>
                <button className="primary-btn small">Publish</button>
              </div>
            </div>
          </div>
          <div className="panel soft">
            <h3>Admin controls coming next</h3>
            <ul className="clean-list">
              <li>User verification</li>
              <li>Neighborhood manager roles</li>
              <li>Category approvals</li>
              <li>Report history</li>
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
