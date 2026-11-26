import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Namla Hotels
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
