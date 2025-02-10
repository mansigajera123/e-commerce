import React, { useState, useEffect } from "react";
import Header from "./header";
import "./css/favourite.css";

const FavoriteProducts = () => {
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "https://outside-friend-jump-convicted.trycloudflare.com/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFavoritesList(data.favorites);
        } else {
          console.error("Error fetching favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    removeFromFavorites();
  }, []);

  const removeFromFavorites = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://outside-friend-jump-convicted.trycloudflare.com/favorites/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setFavoritesList((prevFavorites) =>
          prevFavorites.filter((product) => product._id !== productId)
        );
      } else {
        const errorData = await response.json();
        console.error(
          "Error removing product from favorites:",
          errorData.message
        );
      }
    } catch (error) {
      console.error("Error removing product from favorites:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="favorites-container">
        <h2>Your Favorite Products</h2>
        {favoritesList.length > 0 ? (
          <div className="favorites-list">
            {favoritesList.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={`https://outside-friend-jump-convicted.trycloudflare.com/${product.image}`}
                  alt={product.title}
                  loading="lazy"
                />
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <div className="price">₹{product.price}</div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromFavorites(product._id)}
                >
                  Remove from Favorites
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorite products found</p>
        )}
      </div>
    </>
  );
};

export default FavoriteProducts;
