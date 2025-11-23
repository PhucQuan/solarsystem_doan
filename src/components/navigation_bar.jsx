import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/planets", label: "Planets"},
  { to: "/explore3d", label: "Explore 3D" },
  { to: "/gallery", label: "Gallery" },
  { to: "/articles", label: "Learn"},

  { to: "/about", label: "About"}
];

const STORAGE_KEYS = {
  theme: "solarscope-theme",
  language: "solarscope-language"
};

const getPreferredTheme = () => {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const getPreferredLanguage = () => {
  if (typeof window === "undefined") return "vi";
  const stored = window.localStorage.getItem(STORAGE_KEYS.language);
  if (stored === "vi" || stored === "en") {
    return stored;
  }
  return "vi";
};

export default function Navbar() {
  const location = useLocation();
  const [theme, setTheme] = useState(getPreferredTheme);
  const [language, setLanguage] = useState(getPreferredLanguage);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEYS.language, language);
  }, [language]);

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "vi" ? "en" : "vi"));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      return;
    }
    // TODO: Replace with actual search navigation when the search page is ready.
    if (typeof window !== "undefined") {
      window.alert(`Search coming soon: ${searchTerm.trim()}`);
    }
    setSearchTerm("");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Home">
          <span aria-hidden="true">🪐</span>
          <span className="navbar__brandText">SolarScope</span>
        </Link>

        <nav className="navbar__nav" aria-label="Primary">
          <ul className="navbar__list">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.to === "/" ? activePath === link.to : activePath.startsWith(link.to);
              return (
                <li key={link.to} className="navbar__item">
                  <Link
                    to={link.to}
                    className={`navbar__link${isActive ? " navbar__link--active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    data-optional={link.optional ? "true" : undefined}
                  >
                    <span aria-hidden="true" className="navbar__icon">
                      {link.icon}
                    </span>
                    <span className="navbar__label">{link.label}</span>
                    {link.optional ? (
                      <span className="navbar__optional">Optional</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="navbar__actions">
          <form className="navbar__search" role="search" onSubmit={handleSearchSubmit}>
            <label className="sr-only" htmlFor="navbar-search">
              Search planets or articles
            </label>
            <input
              id="navbar-search"
              type="search"
              className="navbar__searchInput"
              placeholder="Search..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" className="navbar__searchButton" aria-label="Search">
              🔍
            </button>
          </form>

          <div className="navbar__divider" aria-hidden="true" />

          <button
            type="button"
            className="navbar__button"
            onClick={handleThemeToggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? "🌙" : "🌞"}
          </button>

          <button
            type="button"
            className="navbar__button navbar__button--language"
            onClick={handleLanguageToggle}
            aria-label="Toggle language between Vietnamese and English"
          >
            {language === "vi" ? "VN" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
