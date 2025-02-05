import { Link } from "react-router-dom";
import "./header.css";

export default function Header() {
  const logout = () => {
    localStorage.removeItem("authToken");
  };

  const email = localStorage.getItem("email");

  return (
    <>
      <h1>E-Commerce Website</h1>
      <header className="header">
        <nav>
          {localStorage.getItem("authToken") ? (
            <>
              welcome,{email.split("@")[0]}
              <Link to="/allproduct" className="nav-link">
                All Product
              </Link>
              <Link to="/product" className="nav-link">
                My Products
              </Link>
              <Link to="/addproduct" className="nav-link">
                Add Product
              </Link>
              <Link to="/cart" className="nav-link">
                cart
              </Link>
              <Link to="/" className="nav-link" onClick={logout}>
                logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
}
