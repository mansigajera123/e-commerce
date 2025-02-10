import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react"; 
import "./css/header.css";

export default function Header() {
  const logout = () => {
    localStorage.removeItem("authToken");
  };

  const email = localStorage.getItem("email");

  return (
    <>
      <header className="header">
        <nav>
          {localStorage.getItem("authToken") ? (
            <>
              <p
                style={{
                  color: "#2980b9",
                  backgroundColor: "white",
                  textAlign: "center",
                  FontSize: "2000",
                  padding: "20px 15px",
                }}
              >
                Welcome,
                {
                  email
                    .split("@")[0]
                    .replace(/[0-9]/g, "")
                    .split(".")[0]
                    .split(/[0-9]+/)[0]
                }
              </p>

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
                Cart
              </Link>
              <Link to="/favorites" className="nav-link">
                Favorites
              </Link>
              <Link to="/orders" className="nav-link">
                My Orders
              </Link>

              <Link to="/" className="nav-link" onClick={logout}>
                Logout
              </Link>
              <Link to="/profile" className="profile-icon">
                <div>
                  <br />
                  <UserCircle size={40} color="#2980b9" />
                  <p
                    style={{
                      color: "white",
                    }}
                  >
                    profile
                  </p>
                </div>
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
