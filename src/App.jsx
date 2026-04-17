import { useMemo, useState } from "react";
import "./styles.css";

const locations = [
  "Naborly JA",
  "Naborly Barbados",
  "Naborly Trinidad",
  "Naborly Guyana",
  "Naborly USA",
  "Naborly UK",
  "Naborly Toronto",
  "Naborly Africa",
];

const categories = [
  "All",
  "Food for Sale",
  "Food Giveaway",
  "Buy for Family",
  "Skilled Workers",
  "Events",
  "Medication",
  "Urgent Needs",
  "Partners",
];

const quickActions = [
  {
    id: "need-food-now",
    title: "Need Food Now",
    text: "Fast help for urgent food insufficiency needs.",
    tab: "support",
  },
  {
    id: "find-free-food",
    title: "Find Free Food",
    text: "Community pickups, pantry support, and giveaways.",
    tab: "market",
    category: "Food Giveaway",
  },
  {
    id: "buy-for-family",
    title: "Buy for Family",
    text: "Support loved ones in Jamaica from anywhere.",
    tab: "market",
    category: "Buy for Family",
  },
  {
    id: "med-help",
    title: "Medication Help",
    text: "Find medication support and pharmacy guidance.",
    tab: "support",
  },
  {
    id: "hire-local-help",
    title: "Hire Local Talent",
    text: "Trusted neighborhood workers and helpers.",
    tab: "market",
    category: "Skilled Workers",
  },
  {
    id: "community-events",
    title: "Community Events",
    text: "Church, family, music, and neighborhood gatherings.",
    tab: "market",
    category: "Events",
  },
];

const starterListings = [
  {
    id: 1,
    title: "Fresh ackee and bananas",
    category: "Food for Sale",
    location: "Kingston, Jamaica",
    price: "JMD $1,200",
    description: "Fresh produce available for pickup today. Family bundles available.",
    contact: "WhatsApp Vendor",
    badge: "Trusted",
  },
  {
    id: 2,
    title: "Hot meals for pickup",
    category: "Food Giveaway",
    location: "Montego Bay, Jamaica",
    price: "Free",
    description: "Community meal support for families facing food insufficiency.",
    contact: "Community Partner",
    badge: "Urgent Help",
  },
  {
    id: 3,
    title: "Support groceries for family in Jamaica",
    category: "Buy for Family",
    location: "Spanish Town, Jamaica",
    price: "USD $18",
    description: "Diaspora-friendly family support basket with same-day coordination.",
    contact: "Family Support Desk",
    badge: "Diaspora",
  },
  {
    id: 4,
    title: "Plumber available this evening",
    category: "Skilled Workers",
    location: "Spanish Town, Jamaica",
    price: "Quote on request",
    description: "Repairs, leaks, installations, and quick neighborhood calls.",
    contact: "WhatsApp Worker",
    badge: "Local Talent",
  },
  {
    id: 5,
    title: "Local market and family fun day",
    category: "Events",
    location: "Ocho Rios, Jamaica",
    price: "Free entry",
    description: "Food vendors, music, children activities, and local business booths.",
    contact: "Event Team",
    badge: "Community",
  },
  {
    id: 6,
    title: "Medication support directory",
    category: "Medication",
    location: "Islandwide",
    price: "Support Resource",
    description: "Find help locating medication support resources and pharmacy guidance.",
    contact: "Support Desk",
    badge: "Health",
  },
  {
    id: 7,
    title: "Urgent food insufficiency assistance",
    category: "Urgent Needs",
    location: "Neighborhood Support",
    price: "Immediate Help",
    description: "Connect with nearby food support, churches, partners, and emergency contacts.",
    contact: "Naborly Care",
    badge: "Emergency",
  },
  {
    id: 8,
    title: "Church pantry partner",
    category: "Partners",
    location: "St. Catherine, Jamaica",
    price: "Partner Resource",
    description: "A faith-based pantry and support team available for family referrals.",
    contact: "Partner Team",
    badge: "Partner",
  },
];

const partnerPlans = [
  {
    name: "Starter Partner",
    price: "Free",
    text: "Basic listings and community visibility.",
  },
  {
    name: "Featured Seller",
    price: "JMD 3,000 / month",
    text: "Featured placement and stronger promotion.",
  },
  {
    name: "Business Pro",
    price: "JMD 10,000 / month",
    text: "Premium promotion, homepage presence, and growth support.",
  },
];

function WaveHello() {
  return (
    <div className="wave-card">
      <div className="wave-emoji" aria-hidden="true">
        👋🏾
      </div>
      <div>
        <div className="wave-title">Hello Nabor</div>
        <div className="wave-text">
          Welcome to a Jamaica-rooted neighborhood platform where people help,
          trade, connect, and support family.
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState("Naborly JA");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([1, 2, 3, 6]);
  const [activeTab, setActiveTab] = useState("home");
  const [showSignup, setShowSignup] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Food for Sale",
    location: "",
    price: "",
    description: "",
    whatsapp: "",
  });

  const filteredListings = useMemo(() => {
    return starterListings.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const favoriteListings = starterListings.filter((item) => favorites.includes(item.id));

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    alert("Your Naborly listing draft was captured. Next we can connect this to a real database.");
    setFormData({
      title: "",
      category: "Food for Sale",
      location: "",
      price: "",
      description: "",
      whatsapp: "",
    });
  };

  const handleSubscribe = () => {
    if (!subscribeEmail.trim()) return;
    setSubscribeMessage("Thanks for subscribing to Naborly updates.");
    setSubscribeEmail("");
  };

  const handleQuickAction = (action) => {
    setActiveTab(action.tab);
    if (action.category) {
      setSelectedCategory(action.category);
    } else {
      setSelectedCategory("All");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-mark">Naborly</div>
          <div className="brand-sub">Neighbors helping neighbors, selling to neighbors.</div>
        </div>

        <div className="topbar-actions">
          <select
            className="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button className="outline-btn" onClick={() => setActiveTab("account")}>
            Account
          </button>
          <button className="solid-btn" onClick={() => setShowSignup(true)}>
            Sign Up
          </button>
        </div>
      </header>

      <section className="hero jamaica-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-badge">Welcome to Naborly JA</span>
          <h1>
            Food, help, medication support, local talent, events, and family care —
            all in one neighborhood platform.
          </h1>
          <p>
            Naborly is built with Jamaica at its heart and designed to grow across the
            Caribbean and beyond without losing its community soul.
          </p>

          <WaveHello />

          <div className="hero-buttons">
            <button className="solid-btn" onClick={() => setActiveTab("market")}>
              Explore Naborly
            </button>
            <button className="outline-light-btn" onClick={() => setActiveTab("support")}>
              Get Help Now
            </button>
          </div>
        </div>
      </section>

      <nav className="main-tabs">
        <button
          className={activeTab === "home" ? "tab active" : "tab"}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={activeTab === "market" ? "tab active" : "tab"}
          onClick={() => setActiveTab("market")}
        >
          Marketplace
        </button>
        <button
          className={activeTab === "support" ? "tab active" : "tab"}
          onClick={() => setActiveTab("support")}
        >
          Food & Support
        </button>
        <button
          className={activeTab === "partners" ? "tab active" : "tab"}
          onClick={() => setActiveTab("partners")}
        >
          Partners
        </button>
        <button
          className={activeTab === "post" ? "tab active" : "tab"}
          onClick={() => setActiveTab("post")}
        >
          Post
        </button>
        <button
          className={activeTab === "favorites" ? "tab active" : "tab"}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites
        </button>
        <button
          className={activeTab === "account" ? "tab active" : "tab"}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
      </nav>

      <main className="main-content">
        {showSignup && (
          <section className="signup-banner">
            <div>
              <h3>Join Naborly and grow your community</h3>
              <p>
                Sign up to save favorites, post listings, reach partners, subscribe for alerts,
                and stay connected across Jamaica and worldwide Naborly locations.
              </p>
            </div>
            <div className="signup-actions">
              <button className="solid-btn">Create Free Account</button>
              <button className="ghost-btn" onClick={() => setShowSignup(false)}>
                Dismiss
              </button>
            </div>
          </section>
        )}

        {activeTab === "home" && (
          <>
            <section className="quick-action-grid">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="action-card"
                  onClick={() => handleQuickAction(action)}
                >
                  <strong>{action.title}</strong>
                  <span>{action.text}</span>
                </button>
              ))}
            </section>

            <section className="feature-grid">
              <div className="feature-card gold">
                <h3>Food for Sale & Giveaway</h3>
                <p>Fresh produce, hot meals, pantry support, family food help, and local sellers.</p>
              </div>
              <div className="feature-card green">
                <h3>Local Talent & Trusted Workers</h3>
                <p>Connect with neighborhood workers, helpers, service providers, and skilled people.</p>
              </div>
              <div className="feature-card black">
                <h3>Community, Care & Opportunity</h3>
                <p>Events, medication support, referrals, partners, and neighborhood connection.</p>
              </div>
            </section>

            <section className="quick-links">
              <a className="quick-link" href="https://wa.me/" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <button className="quick-link" onClick={() => setActiveTab("support")}>
                Address Food Insufficiency Needs
              </button>
              <button className="quick-link" onClick={() => setActiveTab("support")}>
                Medication Link
              </button>
              <button className="quick-link" onClick={() => setActiveTab("partners")}>
                Partners
              </button>
              <button className="quick-link" onClick={() => setActiveTab("partners")}>
                Subscribe
              </button>
              <button className="quick-link" onClick={() => setActiveTab("account")}>
                Worldwide Locations
              </button>
            </section>

            <section className="section-card">
              <div className="section-header">
                <h2>Featured in {selectedLocation}</h2>
                <button className="text-btn" onClick={() => setActiveTab("market")}>
                  See all
                </button>
              </div>

              <div className="listing-grid">
                {starterListings.slice(0, 4).map((item) => (
                  <article key={item.id} className="listing-card">
                    <span className="pill">{item.category}</span>
                    <span className="micro-badge">{item.badge}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="listing-meta">
                      <span>{item.location}</span>
                      <span>{item.price}</span>
                    </div>
                    <div className="card-actions">
                      <button className="mini-btn" onClick={() => toggleFavorite(item.id)}>
                        {favorites.includes(item.id) ? "Saved" : "Save"}
                      </button>
                      <a
                        className="mini-btn linkish"
                        href="https://wa.me/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="section-card">
              <div className="section-header">
                <h2>Naborly Promise</h2>
              </div>
              <div className="promise-grid">
                <div className="info-box">
                  <strong>Jamaica-first</strong>
                  <p>Built around the way community, family, and WhatsApp connection really work.</p>
                </div>
                <div className="info-box">
                  <strong>Buy for Family</strong>
                  <p>Support loved ones at home from abroad with food and community help.</p>
                </div>
                <div className="info-box">
                  <strong>Real Opportunity</strong>
                  <p>Not just help — also income, partners, promotion, and local growth.</p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "market" && (
          <>
            <section className="filters-bar">
              <input
                className="search-input"
                type="text"
                placeholder="Search food, medication, workers, events, needs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </section>

            <section className="listing-grid">
              {filteredListings.map((item) => (
                <article key={item.id} className="listing-card">
                  <span className="pill">{item.category}</span>
                  <span className="micro-badge">{item.badge}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="listing-meta">
                    <span>{item.location}</span>
                    <span>{item.price}</span>
                  </div>
                  <div className="card-actions">
                    <button className="mini-btn" onClick={() => toggleFavorite(item.id)}>
                      {favorites.includes(item.id) ? "Saved" : "Save"}
                    </button>
                    <a
                      className="mini-btn linkish"
                      href="https://wa.me/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Contact
                    </a>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {activeTab === "support" && (
          <section className="two-col">
            <div className="section-card">
              <h2>Address Food Insufficiency Needs</h2>
              <p>
                Find nearby food support, local partners, church outreach, family meal programs,
                pantry help, and urgent neighborhood assistance.
              </p>
              <ul className="support-list">
                <li>Emergency meal help</li>
                <li>Community food pickups</li>
                <li>Family pantry support</li>
                <li>Church and partner referrals</li>
                <li>Urgent neighborhood contacts</li>
              </ul>
              <a className="solid-btn inline-btn" href="https://wa.me/" target="_blank" rel="noreferrer">
                Ask for Help on WhatsApp
              </a>
            </div>

            <div className="section-card">
              <h2>Medication Support</h2>
              <p>
                Connect people to medication support resources, pharmacies, urgent guidance,
                and family care links.
              </p>
              <div className="info-box">
                <strong>Medication Link</strong>
                <p>
                  This section is where your real medication support link, pharmacy partner, or
                  Med Help flow should live.
                </p>
              </div>
              <button className="outline-btn">View Medication Resources</button>
            </div>
          </section>
        )}

        {activeTab === "partners" && (
          <section className="two-col">
            <div className="section-card">
              <h2>Partners</h2>
              <p>
                Churches, pantries, food providers, pharmacies, local businesses, organizers,
                skilled worker networks, and community groups can all grow through Naborly.
              </p>

              <div className="partner-grid">
                <div className="partner-box">Community Kitchens</div>
                <div className="partner-box">Church Partners</div>
                <div className="partner-box">Local Vendors</div>
                <div className="partner-box">Medication Partners</div>
              </div>

              <div className="partner-plan-grid">
                {partnerPlans.map((plan) => (
                  <div key={plan.name} className="partner-plan">
                    <strong>{plan.name}</strong>
                    <span>{plan.price}</span>
                    <p>{plan.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h2>Subscribe</h2>
              <p>
                Stay updated on listings, neighborhood alerts, food support, urgent needs,
                business growth, and partner opportunities.
              </p>
              <div className="subscribe-box">
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="search-input"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                />
                <button className="solid-btn" onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>
              {subscribeMessage ? <p className="subscribe-note">{subscribeMessage}</p> : null}
            </div>
          </section>
        )}

        {activeTab === "post" && (
          <section className="section-card narrow">
            <h2>Post to the Community</h2>
            <p>
              Offer food, share help, promote an event, list a service, or connect support to people who need it.
            </p>

            <form className="post-form" onSubmit={handlePostSubmit}>
              <input
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="search-input"
                placeholder="Listing title"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="category-select"
              >
                {categories.filter((item) => item !== "All").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <input
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                className="search-input"
                placeholder="Neighborhood / location"
                required
              />

              <input
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                className="search-input"
                placeholder="Price, free, or support type"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="text-area"
                placeholder="Describe your post"
                rows="5"
                required
              />

              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleFormChange}
                className="search-input"
                placeholder="WhatsApp number"
              />

              <div className="upload-box">
                <span>Image upload area</span>
                <small>Next round: connect real uploads and post images.</small>
              </div>

              <button type="submit" className="solid-btn">
                Submit Listing
              </button>
            </form>
          </section>
        )}

        {activeTab === "favorites" && (
          <section className="section-card">
            <h2>Favorites</h2>
            <div className="listing-grid">
              {favoriteListings.length ? (
                favoriteListings.map((item) => (
                  <article key={item.id} className="listing-card">
                    <span className="pill">{item.category}</span>
                    <span className="micro-badge">{item.badge}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="listing-meta">
                      <span>{item.location}</span>
                      <span>{item.price}</span>
                    </div>
                  </article>
                ))
              ) : (
                <p>No favorites yet.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "account" && (
          <section className="two-col">
            <div className="section-card">
              <h2>My Account</h2>
              <p>
                Create your account, manage your profile, save favorites, subscribe for alerts,
                and stay connected to your Naborly locations.
              </p>
              <div className="account-box">
                <div className="account-line"><strong>Name:</strong> Future member</div>
                <div className="account-line"><strong>Location:</strong> {selectedLocation}</div>
                <div className="account-line"><strong>Status:</strong> Sign up encouraged</div>
                <div className="account-line"><strong>Connection:</strong> WhatsApp-first</div>
              </div>
              <button className="solid-btn">Create Account</button>
            </div>

            <div className="section-card">
              <h2>Worldwide Naborly Locations</h2>
              <p>
                Jamaica is the heart, but Naborly can connect islands, diaspora families,
                and neighborhood communities worldwide.
              </p>
              <div className="location-grid">
                {locations.map((location) => (
                  <button
                    key={location}
                    className={
                      selectedLocation === location ? "location-chip active" : "location-chip"
                    }
                    onClick={() => setSelectedLocation(location)}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
