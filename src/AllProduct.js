import { useEffect, useState } from "react";
import "./css/product.css";
import { Link } from "react-router-dom";
import Header from "./header";
import { FaHeart } from "react-icons/fa";

export default function AllProduct() {
  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    document.title = "product";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const searchParam = searchQuery ? `&search=${searchQuery}` : "";
    const categoryParam = category ? `&category=${category}` : "";
    const sortParam = sortBy ? `&sortBy=${sortBy}` : "";
    let minPrice = 0,
      maxPrice = "";
    if (priceRange === "0-1000") {
      minPrice = 0;
      maxPrice = 1000;
    } else if (priceRange === "1000-2000") {
      minPrice = 1000;
      maxPrice = 2000;
    } else if (priceRange === "2000-10000") {
      minPrice = 2000;
      maxPrice = 10000;
    } else if (priceRange === "10000+") {
      minPrice = 10000;
      maxPrice = "";
    }
    const priceParam = maxPrice
      ? `&minPrice=${minPrice}&maxPrice=${maxPrice}`
      : `&minPrice=${minPrice}`;
    const url = `https://believed-holder-univ-direction.trycloudflare.com/allproduct?page=${currentPage}${searchParam}${categoryParam}${priceParam}${sortParam}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.log("Error fetching products:", err));

    fetch(
      `https://believed-holder-univ-direction.trycloudflare.com/favorites`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const favoriteProductIds = new Set(
          data.favorites.map((fav) => fav._id)
        );
        setFavorites(favoriteProductIds);
      })
      .catch((err) => console.log("Error fetching favorites:", err));
  }, [currentPage, searchQuery, category, priceRange, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchRecipe = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
  };

  const toggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const isCurrentlyFavorite = favorites.has(id);

      const response = await fetch(
        `https://believed-holder-univ-direction.trycloudflare.com/toggle-favorite/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isFavorite: !isCurrentlyFavorite }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFavorites((prev) => {
          const updatedFavorites = new Set(prev);
          if (isCurrentlyFavorite) {
            updatedFavorites.delete(id);
          } else {
            updatedFavorites.add(id);
          }
          return updatedFavorites;
        });
      } else {
        console.error("Error updating favorite:", data.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <>
      <Header />
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for Product"
      />
      <button type="submit" onClick={searchRecipe}>
        Search
      </button>

      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Accessories">Accessories</option>
        <option value="Kids">Kids</option>
        <option value="Kitchen Item">Kitchen Item</option>
        <option value="Beauty Product">Beauty Product</option>
      </select>

      <select onChange={handlePriceChange} value={priceRange}>
        <option value="">Select Price Range</option>
        <option value="0-1000">₹0 - ₹1000</option>
        <option value="1000-2000">₹1000 - ₹2000</option>
        <option value="2000-10000">₹2000 - ₹10000</option>
        <option value="10000+">₹10000+</option>
      </select>

      <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
        <option value="">Sort By</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>

      <div className="product-container">
        <h1>Product List</h1>
        <div className="product-list">
          {product.length > 0 ? (
            product.map((item) => (
              <div key={item._id} className="product-card">
                <span
                  className="favorite-icon"
                  onClick={() => toggleFavorite(item._id)}
                  style={{
                    color: favorites.has(item._id) ? "red" : "gray",
                    cursor: "pointer",
                  }}
                >
                  <FaHeart />
                </span>

                <img
                  src={`https://believed-holder-univ-direction.trycloudflare.com/${item.image}`}
                  loading="lazy"
                  alt={item.title}
                />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="price">₹{item.price}</div>
                <div className="product-card">
                  <p>
                    Average Rating:
                    {Array.from(
                      { length: Math.round(item.avgRating) },
                      (_, i) => "⭐"
                    ).join("")}
                  </p>
                </div>

                <Link to={`/detail/${item._id}`}>
                  <button type="button">Detail View</button>
                </Link>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
        <br />
        <br />
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
