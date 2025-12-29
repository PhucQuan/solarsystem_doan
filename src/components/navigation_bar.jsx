import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import GlobalSearch from "./GlobalSearch";
import ThemeToggle from "./ThemeToggle";
import { useApp } from "../contexts/AppContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/planets", label: "Planets" },
  { to: "/explore3d", label: "Explore 3D" },
  { to: "/gallery", label: "Gallery" },
  { to: "/articles", label: "Learn" },
  { to: "/quiz", label: "Quiz" },
  { to: "/analytics", label: "Analytics" },
  { to: "/about", label: "About" }
];

export default function Navbar() {
  const location = useLocation();
  const { favorites } = useApp();
  const activePath = useMemo(() => location.pathname, [location.pathname]);

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
                  >
                    <span className="navbar__label">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="navbar__actions">
          <GlobalSearch />

          <div className="navbar__divider" aria-hidden="true" />

          {/* Favorites Badge */}
          {favorites.count > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="navbar__button"
                onClick={() => window.location.href = '/favorites'}
                aria-label={`${favorites.count} favorites`}
                title="View favorites"
              >
                ❤️
              </button>
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#fff',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {favorites.count}
              </span>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
