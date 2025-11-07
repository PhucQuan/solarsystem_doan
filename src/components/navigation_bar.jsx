import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Home">
          SolarScope
        </Link>
        <nav className="navbar__nav" aria-label="Primary">
          <Link to="/planets" className="navbar__link">Planets</Link>
          <Link to="/explore3d" className="navbar__link">Explore 3D</Link>
        </nav>
      </div>
    </header>
  );
}
