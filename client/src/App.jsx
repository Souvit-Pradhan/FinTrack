import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Salary",
  "Other",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("fintrack_token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("fintrack_user") || "null")
  );
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: today(),
  });
  const [auth, setAuth] = useState({ name: "", email: "", password: "" });
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("fintrack_theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("fintrack_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function request(path, options = {}) {
    const response = await fetch(API + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  useEffect(() => {
    if (!token) return;

    request("/transactions")
      .then(setTransactions)
      .catch(() => logout());
  }, [token]);

  async function submitAuth(e) {
    e.preventDefault();
    setError("");

    try {
      const path = registering ? "/auth/register" : "/auth/login";
      const data = await request(path, {
        method: "POST",
        body: JSON.stringify(auth),
      });

      localStorage.setItem("fintrack_token", data.token);
      localStorage.setItem("fintrack_user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("fintrack_token");
    localStorage.removeItem("fintrack_user");
    setToken(null);
    setUser(null);
    setTransactions([]);
  }

  async function addTransaction(e) {
    e.preventDefault();
    setError("");

    try {
      const item = await request("/transactions", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setTransactions((current) => [item, ...current]);

      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: today(),
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeTransaction(id) {
    try {
      await request(`/transactions/${id}`, { method: "DELETE" });
      setTransactions((current) => current.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const chartTotal = summary.income + summary.expense;
  const incomeWidth =
    chartTotal === 0 ? 0 : (summary.income / chartTotal) * 100;
  const expenseWidth =
    chartTotal === 0 ? 0 : (summary.expense / chartTotal) * 100;

  if (!token) {
    return (
      <main className="auth-page">
        <form className="card auth-card" onSubmit={submitAuth}>
          <div className="brand-mark">₹</div>
          <h1>FinTrack</h1>
          <p className="auth-subtitle">Simple personal finance management.</p>

          {registering && (
            <input
              placeholder="Name"
              value={auth.name}
              onChange={(e) => setAuth({ ...auth, name: e.target.value })}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={auth.email}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            required
          />

          {error && <small className="error">{error}</small>}

          <button type="submit">
            {registering ? "Create account" : "Login"}
          </button>

          <button
            type="button"
            className="link"
            onClick={() => {
              setRegistering(!registering);
              setError("");
            }}
          >
            {registering
              ? "Already have an account? Login"
              : "Create a new account"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <div className="brand-title">FinTrack</div>
          <div className="welcome">Welcome, {user?.name}</div>
        </div>

        <div className="topbar-actions">
          <button
            className="theme-button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀" : "☾"}
          </button>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="summary">
        <div className="card summary-card">
          <span>Balance</span>
          <strong>₹{summary.balance.toFixed(2)}</strong>
          <small>Income minus expenses</small>
        </div>

        <div className="card summary-card">
          <span>Income</span>
          <strong className="income">₹{summary.income.toFixed(2)}</strong>
          <small>Total money received</small>
        </div>

        <div className="card summary-card">
          <span>Expenses</span>
          <strong className="expense">₹{summary.expense.toFixed(2)}</strong>
          <small>Total money spent</small>
        </div>
      </section>

      <section className="grid">
        <form className="card form-card" onSubmit={addTransaction}>
          <div className="section-heading">
            <h2>Add Transaction</h2>
            <p>Record your income or spending.</p>
          </div>

          <label>
            Title
            <input
              placeholder="e.g. Monthly Salary"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label>
            Amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 500"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </label>

          <label>
            Type
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            Category
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </label>

          <button type="submit">Add Transaction</button>
        </form>

        <div className="right-column">
          <section className="card chart-card">
            <div className="section-heading">
              <h2>Money Overview</h2>
              <p>A simple view of your income and expenses.</p>
            </div>

            {chartTotal === 0 ? (
              <p className="muted">Add transactions to see the overview.</p>
            ) : (
              <>
                <div className="bar-chart">
                  <div
                    className="bar income-bar"
                    style={{ width: `${incomeWidth}%` }}
                    title={`Income ₹${summary.income.toFixed(2)}`}
                  />
                  <div
                    className="bar expense-bar"
                    style={{ width: `${expenseWidth}%` }}
                    title={`Expenses ₹${summary.expense.toFixed(2)}`}
                  />
                </div>

                <div className="chart-legend">
                  <span>
                    <i className="dot income-dot" />
                    Income ₹{summary.income.toFixed(2)}
                  </span>
                  <span>
                    <i className="dot expense-dot" />
                    Expenses ₹{summary.expense.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </section>

          <section className="card transactions-card">
            <div className="section-heading">
              <h2>Recent Transactions</h2>
              <p>{transactions.length} transaction(s) recorded</p>
            </div>

            {transactions.length === 0 && (
              <p className="muted">No transactions yet.</p>
            )}

            {transactions.map((t) => (
              <div className="transaction" key={t._id}>
                <div className="transaction-info">
                  <strong>{t.title}</strong>
                  <small>
                    {t.category} •{" "}
                    {new Date(t.date || t.createdAt).toLocaleDateString(
                      "en-IN"
                    )}
                  </small>
                </div>

                <div className="transaction-right">
                  <span className={t.type}>
                    {t.type === "income" ? "+" : "-"}₹
                    {Number(t.amount).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    className="delete"
                    aria-label={`Delete ${t.title}`}
                    onClick={() => removeTransaction(t._id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
