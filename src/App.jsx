import { useMemo, useState } from "react";
import "./styles.css";

const locations = [
  "Naborly JA",
  "Naborly Barbados",
  "Naborly Trinidad",
  "Naborly Guyana",
  "Naborly USA",
  "Naborly UK",
];

const categories = [
  "Food for Sale",
  "Food Giveaway",
  "Skilled Workers",
  "Events",
  "Medication",
  "Urgent Needs",
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
  },
  {
    id: 2,
    title: "Hot meals for pickup",
    category: "Food Giveaway",
    location: "Montego Bay, Jamaica",
    price: "Free",
    description: "Community meal support for families facing food insufficiency.",
    contact: "Community Partner",
  },
  {
    id: 3,
    title: "Plumber available this evening",
    category: "Skilled Workers",
    location: "Spanish Town, Jamaica",
    price: "Quote on request",
    description: "Repairs, leaks, installations, and quick neighborhood calls.",
    contact: "WhatsApp Worker",
  },
  {
    id: 4,
    title: "Local market and family fun day",
    category: "Events",
    location: "Ocho Rios, Jamaica",
    price: "Free entry",
    description: "Food vendors, music, children activities, and local business booths.",
    contact: "Event Team",
  },
  {
    id: 5,
    title: "Medication support directory",
    category: "Medication",
    location: "Islandwide",
    price: "Support Resource",
    description: "Find help locating medication support resources and pharmacy guidance.",
    contact: "Support Desk",
  },
  {
    id: 6,
    title: "Urgent food insufficiency assistance",
    category: "Urgent Needs",
    location: "Neighborhood Support",
    price: "Immediate Help",
    description: "Connect with nearby food support, churches, partners, and emergency contacts.",
    contact: "Naborly Care",
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
          Welcome back to a neighborhood-powered community platform built for connection,
          support, local trade, and everyday help.
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState("Naborly JA");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([1, 5]);
  const [activeTab, setActiveTab] = useState("home");
  const [showSignup, setShowSignup] = useState(true);

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
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
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
    alert("Your listing draft was captured. Next we can connect this to a real database.");
    setFormData({
      title: "",
      category: "Food for Sale",
      location: "",
      price: "",
      description: "",
      whatsapp: "",
    });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-mark">Naborly</div>
          <div className="brand-sub">Community. Food. Support. Opportunity.</div>
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

      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-badge">Welcome to Naborly JA</span>
          <h1>Find food, support, local services, events, and urgent help in your neighborhood.</h1>
          <p>
            Built with the spirit of Jamaica at its center — and designed to grow into
            Naborly communities worldwide.
          </p>

          <WaveHello />

          <div className="hero-buttons">
            <button className="solid-btn" onClick={() => setActiveTab("market")}>
              Explore Marketplace
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
              <h3>Join Naborly and build your community network</h3>
              <p>
                Sign up to save favorites, post listings, reach partners, receive alerts, and
                stay connected across Jamaica and other Naborly locations.
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
            <section className="feature-grid">
              <div className="feature-card gold">
                <h3>Food for Sale & Giveaway</h3>
                <p>Find fresh produce, meals, pantry support, and neighborhood food sharing.</p>
              </div>
              <div className="feature-card green">
                <h3>Skilled Workers</h3>
                <p>Connect with trusted local workers, tradespeople, and service providers.</p>
              </div>
              <div className="feature-card black">
                <h3>Events & Community</h3>
                <p>Discover local events, church gatherings, family days, and business promotions.</p>
              </div>
            </section>

            <section className="quick-links">
              <a className="quick-link" href="https://wa.me/" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <button className="quick-link" onClick={() => setActiveTab("support")}>
                Address Food Insufficiency Needs
              </button>
              <button className="quick-link" onClick={() => setActiveTab("partners")}>
                Partners
              </button>
              <button className="quick-link" onClick={() => setActiveTab("market")}>
                Browse Listings
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
                {starterListings.slice(0, 3).map((item) => (
                  <article key={item.id} className="listing-card">
                    <span className="pill">{item.category}</span>
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
                      <a className="mini-btn linkish" href="https://wa.me/" target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    </div>
                  </article>
                ))}
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
                placeholder="Search food, workers, events, needs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
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
                    <a className="mini-btn linkish" href="https://wa.me/" target="_blank" rel="noreferrer">
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
                and urgent neighborhood assistance.
              </p>
              <ul className="support-list">
                <li>Emergency meal help</li>
                <li>Community food pickups</li>
                <li>Family pantry support</li>
                <li>Neighborhood partner contacts</li>
                <li>Urgent needs and referral links</li>
              </ul>
              <a className="solid-btn inline-btn" href="https://wa.me/" target="_blank" rel="noreferrer">
                Ask for Help on WhatsApp
              </a>
            </div>

            <div className="section-card">
              <h2>Medication Support</h2>
              <p>
                Connect people to medication support resources, guidance, and community help points.
              </p>
              <div className="info-box">
                <strong>Medication Link</strong>
                <p>
                  Add your real pharmacy, partner, or medical resource link here in the next round.
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
                Community groups, churches, food providers, organizers, social support groups,
                skilled worker networks, and local businesses can partner with Naborly.
              </p>
              <div className="partner-grid">
                <div className="partner-box">Community Kitchens</div>
                <div className="partner-box">Church Partners</div>
                <div className="partner-box">Local Vendors</div>
                <div className="partner-box">Medication Support Partners</div>
              </div>
            </div>

            <div className="section-card">
              <h2>Subscribe</h2>
              <p>
                Stay updated on new listings, neighborhood alerts, urgent community needs, and
                partner opportunities.
              </p>
              <div className="subscribe-box">
                <input type="text" placeholder="Enter your email" className="search-input" />
                <button className="solid-btn">Subscribe</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "post" && (
          <section className="section-card narrow">
            <h2>Post a Listing</h2>
            <p>Offer food, share help, promote an event, or connect your service to the community.</p>

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
                {categories.map((category) => (
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
                placeholder="Price or support type"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="text-area"
                placeholder="Describe your listing"
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
                <small>We can connect real photo uploads next.</small>
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
              <p>Create your account, manage your profile, and access saved listings and alerts.</p>
              <div className="account-box">
                <div className="account-line"><strong>Name:</strong> Future member</div>
                <div className="account-line"><strong>Location:</strong> {selectedLocation}</div>
                <div className="account-line"><strong>Status:</strong> Sign up encouraged</div>
              </div>
              <button className="solid-btn">Create Account</button>
            </div>

            <div className="section-card">
              <h2>Worldwide Naborly Locations</h2>
              <p>
                Naborly can grow across islands and communities while keeping the neighborhood
                heart intact.
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
