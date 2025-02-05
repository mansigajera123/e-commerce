import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./header";
import "./detail.css";

export default function DetailView() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const detailsView = () => {
      const token = localStorage.getItem("authToken");
      fetch(`https://pink-places-build.loca.lt/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((product) => {
          setProduct(product);
          setReviews(product.reviews || []);

          const ratings = product.reviews.map((review) => review.rating);
          const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          setAverageRating(isNaN(avgRating) ? 0 : avgRating);
        })
        .catch((err) => console.log(err));
    };
    detailsView();
  }, [id]);

  const addtoCart = (productId, quantity = 1) => {
    const token = localStorage.getItem("authToken");

    fetch(`https://pink-places-build.loca.lt/addtocart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const handleSubmitReview = () => {
    const token = localStorage.getItem("authToken");

    fetch(`https://pink-places-build.loca.lt/${id}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, reviewText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReviews([...reviews, data.product.reviews.pop()]);
        setReviewText("");
        const newReviews = [...reviews, data.product.reviews.pop()];
        const newRatings = newReviews.map((review) => review.rating);
        const newAvgRating =
          newRatings.reduce((a, b) => a + b, 0) / newRatings.length;
        setAverageRating(newAvgRating);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div className="detail-view-container">
        <h1 className="product-title">{product.title}</h1>
        <img
          src={`https://pink-places-build.loca.lt/${product.image}`}
          alt={product.title}
          className="product-image"
        />
        <h2 className="product-price">₹{product.price}</h2>
        <p className="product-description">{product.description}</p>
        <p className="product-category">
          <strong>Category: </strong>
          {product.category}
        </p>
        <Link to="/cart">
          <button
            className="back-button"
            onClick={() => {
              addtoCart(product._id);
            }}
          >
            Add To Cart
          </button>
        </Link>

        <div className="reviews">
          <h3>Customer Reviews</h3>
          <p>Average Rating: {averageRating.toFixed(1)} stars</p>{" "}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review" key={review._id}>
                <strong>{review.userId?.email || "Anonymous"}</strong>
                <p>Rating: {review.rating} stars</p>
                <p>{review.reviewText}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}
          <form onSubmit={(e) => e.preventDefault()} className="review-form">
            <h4>Write a Review</h4>
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>

            <label htmlFor="reviewText">Review</label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <button
              type="button"
              disabled={reviewText.length === 0}
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
