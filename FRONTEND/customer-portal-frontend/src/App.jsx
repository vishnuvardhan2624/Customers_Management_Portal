import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://customers-management-portal.onrender.com/customers";

const emptyCustomer = {
  name: "",
  age: "",
  email: "",
  state: "",
  city: "",
  phone: "",
};

function App() {
  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Customers");

  // Remember selected theme
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("customerPortalTheme") === "dark"
  );

  // Show success and error messages
  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);
  }

  // GET: Fetch all customers
  async function loadCustomers() {
    setLoading(true);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch customers.");
      }

      const data = await response.json();

      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);

      showMessage(
        "Unable to load customers. Check whether the backend is running.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  // Load customers when the page opens
  useEffect(() => {
    loadCustomers();
  }, []);

  // Clear messages automatically
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  // Handle form changes
  function handleChange(event) {
    const { name, value } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Existing validations preserved
  function validateCustomer() {
    if (
      !customer.name.trim() ||
      !customer.age ||
      !customer.email.trim() ||
      !customer.state.trim() ||
      !customer.city.trim() ||
      !String(customer.phone ?? "").trim()
    ) {
      showMessage("Please fill in all fields.", "error");
      return false;
    }

    const age = Number(customer.age);

    if (!Number.isInteger(age) || age <= 0 || age > 120) {
      showMessage("Please enter a valid age.", "error");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customer.email.trim())) {
      showMessage("Please enter a valid email address.", "error");
      return false;
    }

    // Prevent duplicate email addresses
    const emailExists = customers.some(
      (item) =>
        String(item.email ?? "").trim().toLowerCase() ===
          customer.email.trim().toLowerCase() &&
        String(item.cid) !== String(editId)
    );

    if (emailExists) {
      showMessage(
        "This email address is already registered!",
        "error"
      );
      return false;
    }

    // Validate exactly 10 digits
    if (!/^\d{10}$/.test(String(customer.phone ?? "").trim())) {
      showMessage(
        "Phone number must contain exactly 10 digits.",
        "error"
      );
      return false;
    }

    return true;
  }

  // POST: Add customer
  // PUT: Update customer
  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateCustomer()) {
      return;
    }

    const payload = {
      name: customer.name.trim(),
      age: Number(customer.age),
      email: customer.email.trim(),
      state: customer.state.trim(),
      city: customer.city.trim(),
      phone: String(customer.phone ?? "").trim(),
    };

    const isEditing = editId !== null;

    const url = isEditing
      ? `${API_URL}/${editId}`
      : API_URL;

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || `Request failed with status ${response.status}`
        );
      }

      showMessage(
        isEditing
          ? "Customer updated successfully!"
          : "Customer added successfully!",
        "success"
      );

      setCustomer({ ...emptyCustomer });
      setEditId(null);

      await loadCustomers();
    } catch (error) {
      console.error("Submit error:", error);

      showMessage(
        error.message || "Unable to save customer.",
        "error"
      );
    }
  }

  // Edit customer
  function handleEdit(selectedCustomer) {
    setCustomer({
      name: selectedCustomer.name ?? "",
      age: selectedCustomer.age ?? "",
      email: selectedCustomer.email ?? "",
      state: selectedCustomer.state ?? "",
      city: selectedCustomer.city ?? "",
      phone: selectedCustomer.phone ?? "",
    });

    setEditId(selectedCustomer.cid);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Cancel editing
  function handleCancel() {
    setCustomer({ ...emptyCustomer });
    setEditId(null);
    setMessage("");
    setMessageType("");
  }

  // DELETE: Remove customer
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete customer.");
      }

      showMessage("Customer deleted successfully!", "success");

      if (String(editId) === String(id)) {
        handleCancel();
      }

      await loadCustomers();
    } catch (error) {
      console.error("Delete error:", error);
      showMessage(error.message, "error");
    }
  }

  // Search customers by name
  const filteredCustomers = customers.filter((item) =>
    String(item.name ?? "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  // Customer initials
  function getInitials(name) {
    return (
      String(name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "CU"
    );
  }

  // Toggle theme
  function toggleTheme() {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "customerPortalTheme",
      newTheme ? "dark" : "light"
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark-theme" : ""}`}>
      {/* Navigation */}
      <header className="top-navbar">
        <h1 className="brand-name">Customer Portal</h1>

        <nav className="navigation">
          {["Customers", "Reports", "Settings"].map((tab) => (
            <button
              type="button"
              key={tab}
              className={`nav-link ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab(tab);

                if (tab !== "Customers") {
                  showMessage(
                    `${tab} page is not connected yet.`,
                    "error"
                  );
                } else {
                  setMessage("");
                  setMessageType("");
                }
              }}
            >
              {tab}
            </button>
          ))}

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            title={
              darkMode
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            <span>{darkMode ? "☀️" : "🌙"}</span>
            <span className="theme-label">
              {darkMode ? "Light" : "Dark"}
            </span>
          </button>
        </nav>
      </header>

      <main className="main-content">
        {/* Hero section */}
        <section className="hero-section">
          <div className="hero-copy">
            <h2>
              Welcome To,
              <br />
              Customers Portal.
            </h2>
          </div>

          <div className="total-customers">
            <span>Total Customers</span>
            <strong>{customers.length}</strong>
          </div>
        </section>

        {/* Add / Update customer */}
        <section className="customer-form-panel">
          <div className="section-heading">
            <div>
              <h2>
                {editId !== null
                  ? "Update Customer"
                  : "Add New Customer"}
              </h2>

              <p>
                {editId !== null
                  ? "Update your customer information."
                  : "Enter the customer details below."}
              </p>
            </div>

            {editId !== null && (
              <span className="editing-badge">
                EDITING CUSTOMER
              </span>
            )}
          </div>

          {message && (
            <div
              className={`message ${
                messageType === "success" ? "success" : "error"
              }`}
              role="status"
              aria-live="polite"
            >
              <span className="message-indicator">
                {messageType === "success" ? "✓" : "!"}
              </span>

              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Full name"
                aria-label="Full name"
                value={customer.name}
                onChange={handleChange}
                maxLength={100}
                required
              />

              <input
                id="age"
                type="number"
                name="age"
                placeholder="Age"
                aria-label="Age"
                value={customer.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                aria-label="Email"
                value={customer.email}
                onChange={handleChange}
                required
              />

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Phone"
                aria-label="Phone"
                value={customer.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />

              <input
                id="state"
                type="text"
                name="state"
                placeholder="State"
                aria-label="State"
                value={customer.state}
                onChange={handleChange}
                required
              />

              <input
                id="city"
                type="text"
                name="city"
                placeholder="City"
                aria-label="City"
                value={customer.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editId !== null ? "Save Changes" : "Add Customer"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                className="secondary-button"
                onClick={loadCustomers}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </form>
        </section>

        {/* Customer directory */}
        <section className="directory-section">
          <div className="directory-heading">
            <div>
              <span className="eyebrow">YOUR DATABASE</span>

              <h2>Customer Directory</h2>

              <p>
                View, search, edit, or delete your customers.
              </p>
            </div>

            <div className="directory-tools">
              <span className="customer-count-badge">
                {filteredCustomers.length}{" "}
                {filteredCustomers.length === 1
                  ? "customer"
                  : "customers"}
              </span>

              <input
                type="search"
                className="search-input"
                placeholder="Search customers..."
                aria-label="Search customers by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {loading && customers.length === 0 ? (
            <div className="directory-state">
              <div className="loading-spinner" />
              <p>Loading your customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="directory-state">
              <div className="empty-icon">♙</div>

              <h3>No customers found</h3>

              <p>
                {search
                  ? "Try searching with a different name."
                  : "Add your first customer using the form above."}
              </p>
            </div>
          ) : (
            <div className="customer-grid">
              {filteredCustomers.map((item) => (
                <article className="customer-card" key={item.cid}>
                  <div className="customer-card-top">
                    <div className="customer-avatar">
                      {getInitials(item.name)}
                    </div>

                    <div className="customer-primary-info">
                      <h3>{item.name}</h3>
                      <p>Age {item.age}</p>
                    </div>

                    <span className="customer-id">
                      #{item.cid}
                    </span>
                  </div>

                  <div className="location-badge">
                    <span className="location-dot" />
                    {item.city}, {item.state}
                  </div>

                  <div className="customer-details">
                    <div className="detail-row">
                      <span className="detail-icon">@</span>
                      <span className="detail-text">{item.email}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">☎</span>
                      <span className="detail-text">{item.phone}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(item.cid)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="app-footer">
          <span className="footer-brand">Customer Portal</span>
          <span>React · Spring Boot · MySQL</span>
        </footer>
      </main>
    </div>
  );
}

export default App;