import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import "./styles.css";

const APP_URL = "https://naborlyja.com/";
const SHARE_TEXT =
  "Join Naborly JA — a neighborhood ecosystem for food, support, talent, events, vendors, and community connection.";

const MARKETS = [
  "Naborly JA",
  "Naborly Barbados",
  "Naborly Trinidad",
  "Naborly Guyana",
  "Naborly UK",
  "Naborly USA",
  "Naborly Toronto",
];

const POST_CATEGORIES = [
  "Food for Sale",
  "Giveaways",
  "Restaurant Donations",
  "Community Donations",
  "Local Talent / Services",
  "Events in the Naborhood",
  "Help Request",
];

const FILTER_CATEGORIES = ["All", ...POST_CATEGORIES];

const PAYMENT_OPTIONS = [
  "Card",
  "Bank Transfer",
  "Cash at Pickup",
  "Local Wallet",
];

const STARTER_LISTINGS = [
  {
    id: 1,
    title: "Fresh fruit bags",
    category: "Food for Sale",
    location: "Kingston, Jamaica",
    price: "JMD $700",
    description: "Banana, orange, mango, and pineapple bags available for same-day pickup.",
    whatsapp: "18765551001",
    seller: "Marcia's Produce",
    quantity: 8,
    claimed: 2,
    itemsAvailable: "Banana, orange, pineapple, mango",
    badge: "Trusted Vendor",
    ownPost: false,
    featured: true,
  },
  {
    id: 2,
    title: "Restaurant meal donations",
    category: "Restaurant Donations",
    location: "Half Way Tree, Jamaica",
    price: "Free",
    description: "Prepared meals available for evening pickup while quantities last.",
    whatsapp: "18765551002",
    seller: "Island Kitchen",
    quantity: 20,
    claimed: 11,
    itemsAvailable: "Rice meals, chicken meals, vegetable meals",
    badge: "Restaurant Donation",
    ownPost: false,
    featured: true,
  },
  {
    id: 3,
    title: "Light housekeeping and support",
    category: "Local Talent / Services",
    location: "Portmore, Jamaica",
    price: "JMD $1,500 / visit",
    description: "Cleaning, tidying, errands, and light household support.",
    whatsapp: "18765551003",
    seller: "Sandra M.",
    quantity: 3,
    claimed: 0,
    itemsAvailable: "Morning slots, afternoon slots, evening slots",
    badge: "Local Talent",
    ownPost: false,
    featured: true,
  },
  {
    id: 4,
    title: "Community family day",
    category: "Events in the Naborhood",
    location: "Ocho Rios, Jamaica",
    price: "Free Entry",
    description: "Music, food vendors, giveaways, children activities, and local business booths.",
    whatsapp: "18765551004",
    seller: "City Organizers",
    quantity: 150,
    claimed: 43,
    itemsAvailable: "Family entry spots",
    badge: "Community Event",
    ownPost: false,
    featured: false,
  },
  {
    id: 5,
    title: "Neighborhood grocery giveaway",
    category: "Giveaways",
    location: "Spanish Town, Jamaica",
    price: "Free",
    description: "Pantry items and produce for pickup while supplies last.",
    whatsapp: "18765551005",
    seller: "Community Hub",
    quantity: 15,
    claimed: 15,
    itemsAvailable: "Rice, canned goods, bread, produce",
    badge: "Fully Claimed",
    ownPost: false,
    featured: false,
  },
  {
    id: 6,
    title: "Church pantry support",
    category: "Community Donations",
    location: "St. Catherine, Jamaica",
    price: "Free",
    description: "Food support and household essentials available by referral.",
    whatsapp: "18765551006",
    seller: "Grace Community Church",
    quantity: 12,
    claimed: 5,
    itemsAvailable: "Food boxes, baby items, toiletries",
    badge: "Partner",
    ownPost: false,
    featured: false,
  },
  {
    id: 7,
    title: "Driver available for appointments",
    category: "Local Talent / Services",
    location: "Montego Bay, Jamaica",
    price: "From JMD $2,000",
    description: "Local rides for appointments, school pickup, errands, and airport runs.",
    whatsapp: "18765551007",
    seller: "Andre Rides",
    quantity: 5,
    claimed: 1,
    itemsAvailable: "5 open booking slots",
    badge: "Book Talent",
    ownPost: false,
    featured: false,
  },
];

function whatsappLink(number, title) {
  const clean = String(number || "").replace(/\D/g, "");
  const msg = encodeURIComponent(`Hi, I saw "${title}" on Naborly JA. Is it still available?`);
  return clean ? `https://wa.me/${clean}?text=${msg}` : `https://wa.me/?text=${msg}`;
}

function qtyLeft(item) {
  return Math.max(Number(item.quantity || 0) - Number(item.claimed || 0), 0);
}

function listingStatus(item) {
  const left = qtyLeft(item);
  if (left <= 0) return "Claimed / No longer available";
  if (left <= 2) return `Only ${left} left`;
  return `${left} available`;
}

function qrCodeUrl(link) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(link)}`;
}

function WaveHello() {
  return (
    <div className="wave-card">
      <div className="wave-emoji">👋🏾</div>
      <div>
        <div className="wave-title">Hello Nabor</div>
        <div className="wave-text">
          A neighborhood ecosystem for food, support, talent, events, vendors,
          donations, and community connection.
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedMarket, setSelectedMarket] = useState("Naborly JA");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSignup, setShowSignup] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [naborPoints] = useState(340);
  const [savedIds, setSavedIds] = useState([1, 2, 3]);
  const [bookingItem, setBookingItem] = useState(null);
  const [medSubmitted, setMedSubmitted] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [listings, setListings] = useState(STARTER_LISTINGS);
  const [editingId, setEditingId] = useState(null);
const [user, setUser] = useState(null);
const [showAuthModal, setShowAuthModal] = useState(false);
const [authMode, setAuthMode] = useState("signin");
const [authMessage, setAuthMessage] = useState("");

const [authForm, setAuthForm] = useState({
  fullName: "",
  whatsapp: "",
  email: "",
  password: "",
});
  const [formData, setFormData] = useState({
    title: "",
    category: "Food for Sale",
    location: "",
    price: "",
    description: "",
    whatsapp: "",
    quantity: "",
    itemsAvailable: "",
  });

  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const [medForm, setMedForm] = useState({
    patientName: "",
    medicationNeed: "",
    pickupMode: "Pickup",
    paymentOption: "Card",
    whatsapp: "",
    notes: "",
    prescriptionName: "",
  });
useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user || null);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
  });

  return () => subscription.unsubscribe();
}, []);
  const stats = useMemo(() => {
    const activeListings = listings.filter((item) => qtyLeft(item) > 0).length;
    const talentCount = listings.filter(
      (item) => item.category === "Local Talent / Services" && qtyLeft(item) > 0
    ).length;
    const eventCount = listings.filter(
      (item) => item.category === "Events in the Naborhood" && qtyLeft(item) > 0
    ).length;
    const donationCount = listings.filter(
      (item) =>
        item.category === "Restaurant Donations" ||
        item.category === "Community Donations" ||
        item.category === "Giveaways"
    ).length;
    return { activeListings, talentCount, eventCount, donationCount };
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const categoryOk =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const searchOk =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.seller.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.itemsAvailable.toLowerCase().includes(q);
      return categoryOk && searchOk;
    });
  }, [listings, selectedCategory, searchTerm]);

  const featuredListings = listings.filter((item) => item.featured).slice(0, 4);
  const savedListings = listings.filter((item) => savedIds.includes(item.id));
  const myPosts = listings.filter((item) => item.ownPost);

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      alert("Could not copy link.");
    }
  };

  const handleSubscribe = () => {
    if (!subscribeEmail.trim()) return;
    setSubscribeMessage("You are subscribed to Naborly updates.");
    setSubscribeEmail("");
  };
const handleAuthChange = (e) => {
  const { name, value } = e.target;
  setAuthForm((prev) => ({ ...prev, [name]: value }));
};

const handleSignUp = async (e) => {
  e.preventDefault();
  setAuthMessage("");

  const { data, error } = await supabase.auth.signUp({
    email: authForm.email,
    password: authForm.password,
    options: {
      data: {
        full_name: authForm.fullName,
        whatsapp: authForm.whatsapp,
      },
    },
  });

  if (error) {
    setAuthMessage(error.message);
    return;
  }

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: authForm.fullName,
      whatsapp: authForm.whatsapp,
      market: selectedMarket,
    });
  }

  setAuthMessage("Account created.");
};

const handleSignIn = async (e) => {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithPassword({
    email: authForm.email,
    password: authForm.password,
  });

  if (error) {
    setAuthMessage(error.message);
    return;
  }

  setShowAuthModal(false);
};

const handleSignOut = async () => {
  await supabase.auth.signOut();
};
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitPost = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.description) return;

    if (editingId) {
      setListings((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
                quantity: Number(formData.quantity || 1),
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        title: formData.title,
        category: formData.category,
        location: formData.location,
        price: formData.price || "Free",
        description: formData.description,
        whatsapp: formData.whatsapp,
        seller: "You",
        quantity: Number(formData.quantity || 1),
        claimed: 0,
        itemsAvailable: formData.itemsAvailable || "See listing details",
        badge: "New Post",
        ownPost: true,
        featured: false,
      };
      setListings((prev) => [newItem, ...prev]);
    }

    setEditingId(null);
    setFormData({
      title: "",
      category: "Food for Sale",
      location: "",
      price: "",
      description: "",
      whatsapp: "",
      quantity: "",
      itemsAvailable: "",
    });
    setActiveTab("marketplace");
  };

  const editPost = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      location: item.location,
      price: item.price,
      description: item.description,
      whatsapp: item.whatsapp,
      quantity: String(item.quantity),
      itemsAvailable: item.itemsAvailable,
    });
    setActiveTab("post");
  };

  const bookTalent = (item) => {
    setBookingItem(item);
    setBookingMessage("");
    setBookingData({
      date: "",
      time: "",
      notes: "",
    });
  };

  const submitBooking = () => {
    if (!bookingData.date || !bookingData.time) return;
    setBookingMessage("Booking request captured. Next we can connect this to a real calendar backend.");
  };

  const handleMedUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedForm((prev) => ({ ...prev, prescriptionName: file.name }));
    }
  };

  const submitMedSupport = (e) => {
    e.preventDefault();
    setMedSubmitted(true);
  };

  const ads = [
    { title: "Featured Vendor", text: "Promote your products to the naborhood." },
    { title: "Featured Talent", text: "Book trusted local help faster." },
    { title: "Sponsored Event", text: "Bring more people to your event." },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-stack">
          <div className="brand-mark">Naborly</div>
          <div className="welcome-inline">Welcome to Naborly JA</div>
          <div className="brand-sub">
            Neighbors helping neighbors, selling to neighbors.
          </div>
        </div>

        <div className="topbar-actions">
          <select
            className="location-select"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            {MARKETS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button
  className="outline-btn"
  onClick={() => {
    if (user) {
      setActiveTab("account");
    } else {
      setAuthMode("signin");
      setShowAuthModal(true);
    }
  }}
>
  {user ? "Account" : "Sign In"}
</button>

<button
  className="solid-btn"
  onClick={() => {
    if (user) {
      setActiveTab("account");
    } else {
      setAuthMode("signup");
      setShowAuthModal(true);
    }
  }}
>
  {user ? "My Account" : "Sign Up"}
</button>
        </div>
      </header>

      <section className="hero jamaica-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>
            Food, support, local talent, events in the naborhood, restaurant donations,
            community giving, and direct vendor connection.
          </h1>
          <p>
            A premium neighborhood ecosystem built for everyday life, opportunity,
            care, and growth.
          </p>
          <WaveHello />

          <div className="hero-buttons">
            <button className="solid-btn" onClick={() => setActiveTab("marketplace")}>
              Explore Marketplace
            </button>
            <button className="outline-light-btn" onClick={() => setActiveTab("support")}>
              Food & Support
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
          className={activeTab === "marketplace" ? "tab active" : "tab"}
          onClick={() => setActiveTab("marketplace")}
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
          className={activeTab === "post" ? "tab active" : "tab"}
          onClick={() => setActiveTab("post")}
        >
          Post to Naborhood
        </button>
        <button
          className={activeTab === "partners" ? "tab active" : "tab"}
          onClick={() => setActiveTab("partners")}
        >
          Partners & Ads
        </button>
        <button
          className={activeTab === "saved" ? "tab active" : "tab"}
          onClick={() => setActiveTab("saved")}
        >
          Saved & Followed
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
              <h3>Join, share, and earn Nabor Points</h3>
              <p>
                Sign up, share Naborly with your community, connect by WhatsApp,
                and grow your neighborhood ecosystem.
              </p>
            </div>
            <div className="signup-actions">
              <button
  className="solid-btn"
  onClick={() => {
    setAuthMode("signup");
    setShowAuthModal(true);
  }}
>
  Create Free Account
</button>
              <button className="ghost-btn" onClick={() => setShowSignup(false)}>
                Dismiss
              </button>
            </div>
          </section>
        )}

        {activeTab === "home" && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <strong>{stats.activeListings}</strong>
                <span>Active Listings</span>
              </div>
              <div className="stat-card">
                <strong>{stats.talentCount}</strong>
                <span>Local Talent</span>
              </div>
              <div className="stat-card">
                <strong>{stats.eventCount}</strong>
                <span>Events Nearby</span>
              </div>
              <div className="stat-card">
                <strong>{stats.donationCount}</strong>
                <span>Donations & Giveaways</span>
              </div>
              <div className="stat-card">
                <strong>{savedIds.length}</strong>
                <span>Saved & Followed</span>
              </div>
              <div className="stat-card">
                <strong>{naborPoints}</strong>
                <span>Nabor Points</span>
              </div>
            </section>

            <section className="quick-action-grid">
              <button className="action-card" onClick={() => setActiveTab("support")}>
                <strong>Food Support</strong>
                <span>Emergency help, giveaways, restaurant donations, and community support.</span>
              </button>
              <button className="action-card" onClick={() => {
                setActiveTab("marketplace");
                setSelectedCategory("Local Talent / Services");
              }}>
                <strong>Hire Local Talent</strong>
                <span>Book trusted neighborhood talent and service providers.</span>
              </button>
              <button className="action-card" onClick={() => {
                setActiveTab("marketplace");
                setSelectedCategory("Events in the Naborhood");
              }}>
                <strong>Events in the Naborhood</strong>
                <span>Find what is happening nearby and promote your next event.</span>
              </button>
              <button className="action-card" onClick={() => setActiveTab("post")}>
                <strong>Post to Naborhood</strong>
                <span>Sell, donate, promote, request help, or share a service.</span>
              </button>
            </section>

            <section className="quick-links">
              <a className="quick-link" href={whatsappLink("", "Naborly JA")} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <button className="quick-link" onClick={() => setActiveTab("support")}>
                Med Support
              </button>
              <button className="quick-link" onClick={() => setActiveTab("partners")}>
                Restaurant Donations
              </button>
              <button className="quick-link" onClick={() => setActiveTab("partners")}>
                Community Donations
              </button>
              <button className="quick-link" onClick={() => setActiveTab("account")}>
                Share & Earn
              </button>
            </section>

            <section className="section-card">
              <div className="section-header">
                <h2>Featured in {selectedMarket}</h2>
                <button className="text-btn" onClick={() => setActiveTab("marketplace")}>
                  See all
                </button>
              </div>

              <div className="listing-grid">
                {featuredListings.map((item) => (
                  <article key={item.id} className="listing-card">
                    <div className="listing-topline">
                      <span className="pill">{item.category}</span>
                      <span className="micro-badge">{item.badge}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="listing-meta">
                      <span>{item.location}</span>
                      <span>{item.price}</span>
                    </div>
                    <div className="listing-qty">What’s available: {item.itemsAvailable}</div>
                    <div className="listing-qty">{listingStatus(item)}</div>

                    <div className="card-actions">
                      <button className="mini-btn" onClick={() => toggleSave(item.id)}>
                        {savedIds.includes(item.id) ? "Saved" : "Save"}
                      </button>
                      <a className="mini-btn linkish" href={whatsappLink(item.whatsapp, item.title)} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                      {item.category === "Local Talent / Services" ? (
                        <button className="mini-btn" onClick={() => bookTalent(item)}>
                          Book
                        </button>
                      ) : (
                        <button className="mini-btn" onClick={() => alert("Payment flow placeholder. Next we can connect real payments.")}>
                          Pay / Reserve
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "marketplace" && (
          <>
            <section className="filters-bar">
              <input
                className="search-input"
                type="text"
                placeholder="Search food, donations, events, talent, support..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {FILTER_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </section>

            <section className="listing-grid">
              {filteredListings.map((item) => (
                <article key={item.id} className={`listing-card ${qtyLeft(item) <= 0 ? "sold-out" : ""}`}>
                  <div className="listing-topline">
                    <span className="pill">{item.category}</span>
                    <span className="micro-badge">{item.badge}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="listing-meta">
                    <span>{item.location}</span>
                    <span>{item.price}</span>
                  </div>
                  <div className="listing-qty">What’s available: {item.itemsAvailable}</div>
                  <div className="listing-qty">Quantity: {item.quantity}</div>
                  <div className="listing-qty">{listingStatus(item)}</div>

                  <div className="payment-links">
                    {PAYMENT_OPTIONS.map((option) => (
                      <span key={option} className="payment-pill">
                        {option}
                      </span>
                    ))}
                  </div>

                  <div className="card-actions">
                    <button className="mini-btn" onClick={() => toggleSave(item.id)}>
                      {savedIds.includes(item.id) ? "Saved" : "Save"}
                    </button>

                    <a
                      className="mini-btn linkish"
                      href={whatsappLink(item.whatsapp, item.title)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp Vendor
                    </a>

                    {item.category === "Local Talent / Services" ? (
                      <button className="mini-btn" onClick={() => bookTalent(item)}>
                        Book Talent
                      </button>
                    ) : (
                      <button
                        className="mini-btn"
                        onClick={() => alert("Payment/reserve flow placeholder. Next we can connect real payments.")}
                      >
                        Pay / Reserve
                      </button>
                    )}

                    {item.ownPost ? (
                      <button className="mini-btn" onClick={() => editPost(item)}>
                        Edit Post
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {activeTab === "support" && (
          <section className="two-col">
            <div className="section-card">
              <h2>Food & Support</h2>
              <p>
                Find restaurant donations, giveaways, community donations, and neighborhood support.
              </p>
              <ul className="support-list">
                <li>Restaurant food donations</li>
                <li>Community giveaways</li>
                <li>Church and partner support</li>
                <li>Help requests</li>
                <li>Direct WhatsApp coordination</li>
              </ul>
              <a className="solid-btn inline-btn" href={whatsappLink("", "Food Support")} target="_blank" rel="noreferrer">
                Ask for Help on WhatsApp
              </a>
            </div>

            <div className="section-card">
              <h2>Med Support</h2>
              <p>
                Upload prescription details, choose payment or pickup, and coordinate by WhatsApp.
              </p>

              <form className="post-form" onSubmit={submitMedSupport}>
                <input
                  className="search-input"
                  placeholder="Patient name"
                  value={medForm.patientName}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, patientName: e.target.value }))}
                />
                <input
                  className="search-input"
                  placeholder="Medication needed"
                  value={medForm.medicationNeed}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, medicationNeed: e.target.value }))}
                />
                <input
                  className="search-input"
                  placeholder="WhatsApp number"
                  value={medForm.whatsapp}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                />
                <select
                  className="category-select"
                  value={medForm.pickupMode}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, pickupMode: e.target.value }))}
                >
                  <option>Pickup</option>
                  <option>Payment + Delivery</option>
                </select>
                <select
                  className="category-select"
                  value={medForm.paymentOption}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, paymentOption: e.target.value }))}
                >
                  {PAYMENT_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <label className="upload-box upload-left">
                  <strong>Prescription Upload</strong>
                  <small>{medForm.prescriptionName || "Attach prescription image or file"}</small>
                  <input type="file" className="hidden-input" onChange={handleMedUpload} />
                </label>
                <textarea
                  className="text-area"
                  rows="4"
                  placeholder="Notes"
                  value={medForm.notes}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
                <div className="info-box">
                  <strong>Pickup note</strong>
                  <p>
                    If a family member or helper is picking up medication, the prescription
                    should be presented at pickup.
                  </p>
                </div>
                <div className="card-actions">
                  <button className="solid-btn" type="submit">
                    Submit Med Support
                  </button>
                  <a
                    className="mini-btn linkish"
                    href={whatsappLink(medForm.whatsapp, "Medication Support")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp Support
                  </a>
                </div>
              </form>

              {medSubmitted ? (
                <p className="subscribe-note">Med Support request captured.</p>
              ) : null}
            </div>
          </section>
        )}

        {activeTab === "post" && (
          <section className="section-card narrow">
            <h2>{editingId ? "Edit Post to Naborhood" : "Post to Naborhood"}</h2>
            <p>
              Sell, donate, promote, share a service, post an event, or request help.
            </p>

            <form className="post-form" onSubmit={submitPost}>
              <input
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="search-input"
                placeholder="Post title"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="category-select"
              >
                {POST_CATEGORIES.map((category) => (
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
                placeholder="Price or Free"
              />

              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                className="search-input"
                placeholder="Quantity available"
              />

              <input
                name="itemsAvailable"
                value={formData.itemsAvailable}
                onChange={handleFormChange}
                className="search-input"
                placeholder="What’s available if more than one"
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
                <small>Next: connect real uploads and gallery images.</small>
              </div>

              <div className="card-actions">
                <button type="submit" className="solid-btn">
                  {editingId ? "Save Changes" : "Post to Naborhood"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    className="mini-btn"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title: "",
                        category: "Food for Sale",
                        location: "",
                        price: "",
                        description: "",
                        whatsapp: "",
                        quantity: "",
                        itemsAvailable: "",
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        )}

        {activeTab === "partners" && (
          <section className="two-col">
            <div className="section-card">
              <h2>Partners & Ads</h2>
              <p>
                Restaurants, churches, vendors, events, talent, and neighborhood businesses can
                grow through Naborly.
              </p>
              <div className="partner-grid">
                <div className="partner-box">Restaurant Donations</div>
                <div className="partner-box">Community Donations</div>
                <div className="partner-box">Featured Vendors</div>
                <div className="partner-box">Promoted Events</div>
              </div>
              <div className="partner-plan-grid">
                <div className="partner-plan">
                  <strong>Starter Partner</strong>
                  <span>Free</span>
                  <p>Basic presence and community visibility.</p>
                </div>
                <div className="partner-plan">
                  <strong>Featured Seller</strong>
                  <span>JMD 3,000 / month</span>
                  <p>Featured placement for products and services.</p>
                </div>
                <div className="partner-plan">
                  <strong>Business Pro</strong>
                  <span>JMD 10,000 / month</span>
                  <p>Homepage exposure, promoted listings, and better reach.</p>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h2>Sponsored Spaces</h2>
              <div className="ads-grid">
                {ads.map((ad) => (
                  <div className="ad-card" key={ad.title}>
                    <strong>{ad.title}</strong>
                    <p>{ad.text}</p>
                    <button   className="mini-btn"   onClick={() => setActiveTab("partners")} >   Promote </button>
                  </div>
                ))}
              </div>
              <div className="subscribe-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter your email"
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

        {activeTab === "saved" && (
          <section className="section-card">
            <h2>Saved & Followed</h2>
            <div className="listing-grid">
              {savedListings.length ? (
                savedListings.map((item) => (
                  <article key={item.id} className="listing-card">
                    <div className="listing-topline">
                      <span className="pill">{item.category}</span>
                      <span className="micro-badge">{item.badge}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="listing-meta">
                      <span>{item.location}</span>
                      <span>{item.price}</span>
                    </div>
                    <div className="listing-qty">{listingStatus(item)}</div>
                  </article>
                ))
              ) : (
                <p>No saved posts yet.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "account" && (
          <section className="two-col">
            <div className="section-card">
              <h2>Account</h2>
              <div className="account-box">
                <div className="account-line"><strong>Profile:</strong> Community Member</div>
                <div className="account-line"><strong>Market:</strong> {selectedMarket}</div>
                <div className="account-line"><strong>Nabor Points:</strong> {naborPoints}</div>
                <div className="account-line"><strong>My Posts:</strong> {myPosts.length}</div>
              </div>
<div className="card-actions">
  {user ? (
    <button className="mini-btn" onClick={handleSignOut}>
      Sign Out
    </button>
  ) : (
    <>
      <button
        className="mini-btn"
        onClick={() => {
          setAuthMode("signin");
          setShowAuthModal(true);
        }}
      >
        Sign In
      </button>
      <button
        className="mini-btn"
        onClick={() => {
          setAuthMode("signup");
          setShowAuthModal(true);
        }}
      >
        Create Free Account
      </button>
    </>
  )}
</div>
              <div className="section-card inner-card">
                <h3>Share & Earn</h3>
                <p>Share Naborly by QR, WhatsApp, or social and earn Nabor Points.</p>
                <div className="qr-box">
                  <img src={qrCodeUrl(APP_URL)} alt="Naborly QR" className="qr-image" />
                </div>
                <div className="card-actions">
                  <a
                    className="mini-btn linkish"
                    href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${APP_URL}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share on WhatsApp
                  </a>
                  <a
                    className="mini-btn linkish"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share to Social
                  </a>
                  <button className="mini-btn" onClick={copyShareLink}>
                    {shareCopied ? "Copied" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h2>Tracking & Stats</h2>
              <div className="promise-grid">
                <div className="info-box">
                  <strong>Active Listings</strong>
                  <p>{stats.activeListings}</p>
                </div>
                <div className="info-box">
                  <strong>WhatsApp-Ready Posts</strong>
                  <p>{listings.filter((item) => item.whatsapp).length}</p>
                </div>
                <div className="info-box">
                  <strong>Saved & Followed</strong>
                  <p>{savedIds.length}</p>
                </div>
                <div className="info-box">
                  <strong>My Editable Posts</strong>
                  <p>{myPosts.length}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
{showAuthModal ? (
  <div className="modal-backdrop">
    <div className="modal-card">
      <div className="modal-head">
        <h3>{authMode === "signup" ? "Create Free Account" : "Sign In"}</h3>
        <button className="mini-btn" onClick={() => setShowAuthModal(false)}>
          Close
        </button>
      </div>

      <form
        className="post-form"
        onSubmit={authMode === "signup" ? handleSignUp : handleSignIn}
      >
        {authMode === "signup" ? (
          <>
            <input
              className="search-input"
              name="fullName"
              placeholder="Full name"
              value={authForm.fullName}
              onChange={handleAuthChange}
            />
            <input
              className="search-input"
              name="whatsapp"
              placeholder="WhatsApp number"
              value={authForm.whatsapp}
              onChange={handleAuthChange}
            />
          </>
        ) : null}

        <input
          className="search-input"
          name="email"
          type="email"
          placeholder="Email"
          value={authForm.email}
          onChange={handleAuthChange}
        />

        <input
          className="search-input"
          name="password"
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={handleAuthChange}
        />

        <button className="solid-btn" type="submit">
          {authMode === "signup" ? "Create Account" : "Sign In"}
        </button>

        <button
          type="button"
          className="mini-btn"
          onClick={() =>
            setAuthMode((prev) => (prev === "signup" ? "signin" : "signup"))
          }
        >
          {authMode === "signup"
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </button>

        {authMessage ? <p className="subscribe-note">{authMessage}</p> : null}
      </form>
    </div>
  </div>
) : null}
      {bookingItem ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3>Book Talent Appointment</h3>
              <button className="mini-btn" onClick={() => setBookingItem(null)}>Close</button>
            </div>
            <p className="modal-sub">
              {bookingItem.title} · {bookingItem.location}
            </p>
            <div className="post-form">
              <input
                className="search-input"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData((prev) => ({ ...prev, date: e.target.value }))}
              />
              <input
                className="search-input"
                type="time"
                value={bookingData.time}
                onChange={(e) => setBookingData((prev) => ({ ...prev, time: e.target.value }))}
              />
              <textarea
                className="text-area"
                rows="3"
                placeholder="Notes"
                value={bookingData.notes}
                onChange={(e) => setBookingData((prev) => ({ ...prev, notes: e.target.value }))}
              />
              <div className="card-actions">
                <button className="solid-btn" onClick={submitBooking}>
                  Confirm Booking
                </button>
                <a
                  className="mini-btn linkish"
                  href={whatsappLink(bookingItem.whatsapp, bookingItem.title)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp Talent
                </a>
              </div>
              {bookingMessage ? <p className="subscribe-note">{bookingMessage}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
