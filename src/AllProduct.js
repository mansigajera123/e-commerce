import { useEffect, useState } from "react";
import "./product.css";
import { Link } from "react-router-dom";
import Header from "./header";
import { FaStar } from "react-icons/fa";

export default function AllProduct() {
  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const searchParam = searchQuery ? `&search=${searchQuery}` : "";
    const categoryParam = category ? `&category=${category}` : "";
    let minPrice = 0,
      maxPrice = "";
    if (priceRange === "0-500") {
      minPrice = 0;
      maxPrice = 500;
    } else if (priceRange === "500-1000") {
      minPrice = 500;
      maxPrice = 1000;
    } else if (priceRange === "1000-5000") {
      minPrice = 1000;
      maxPrice = 5000;
    } else if (priceRange === "5000+") {
      minPrice = 5000;
      maxPrice = "";
    }
    const priceParam = maxPrice
      ? `&minPrice=${minPrice}&maxPrice=${maxPrice}`
      : `&minPrice=${minPrice}`;
    const url = `https://pink-places-build.loca.lt/allproduct?page=${currentPage}${searchParam}${categoryParam}${priceParam}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProduct(data.product);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.log("Error fetching products:", err));
  }, [currentPage, searchQuery, category, priceRange]);

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

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
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
      </select>

      <select onChange={handlePriceChange} value={priceRange}>
        <option value="">Select Price Range</option>
        <option value="0-500">₹0 - ₹500</option>
        <option value="500-1000">₹500 - ₹1000</option>
        <option value="1000-5000">₹1000 - ₹5000</option>
        <option value="5000+">₹5000+</option>
      </select>

      <div className="product-container">
        <h1>Product List</h1>
        <div className="product-list">
          {product.length > 0 ? (
            product.map((item) => (
              <div key={item._id} className="product-card">
                {/* <button
                  className={`favorite-button ${
                    favorites.includes(item._id) ? "favorited" : ""
                  }`}
                  onClick={() => toggleFavorite(item._id)}
                >
                  <FaStar />
                </button> */}
                <img
                  src={`https://pink-places-build.loca.lt/${item.image}`}
                  loading="lazy"
                  alt={item.title}
                />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="price">₹{item.price}</div>

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
