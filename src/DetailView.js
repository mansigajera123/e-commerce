// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import Header from "./header";
// import "./css/detail.css";

// export default function DetailView() {
//   const [product, setProduct] = useState({});
//   const { id } = useParams();
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(1);
//   const [reviewText, setReviewText] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const detailsView = () => {
//       const token = localStorage.getItem("authToken");
//       fetch(
//         `https://logos-annex-qualifying-bob.trycloudflare.com/detail/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//         .then((res) => res.json())
//         .then((product) => {
//           setProduct(product);
//           setReviews(product.reviews || []);
//         })
//         .catch((err) => console.log(err));
//     };
//     detailsView();
//   }, [id]);

//   const addtoCart = (productId, quantity = 1) => {
//     const token = localStorage.getItem("authToken");

//     fetch(`https://logos-annex-qualifying-bob.trycloudflare.com/addtocart`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ productId, quantity }),
//     })
//       .then((res) => res.json())
//       .catch((err) => console.log(err));
//   };

//   const handleSubmitReview = () => {
//     const token = localStorage.getItem("authToken");

//     fetch(
//       `https://logos-annex-qualifying-bob.trycloudflare.com/${id}/reviews`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ rating, reviewText }),
//       }
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setReviews([...reviews, data.product.reviews.pop()]);
//         setReviewText("");
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleImageClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <Header />
//       <div className="detail-view-container">
//         <h1 className="product-title">{product.title}</h1>
//         <img
//           src={`https://logos-annex-qualifying-bob.trycloudflare.com/${product.image}`}
//           alt={product.title}
//           className="product-image"
//           onClick={handleImageClick}
//         />

//         {isModalOpen && (
//           <div className="modal" onClick={handleCloseModal}>
//             <div className="modal-content">
//               <span className="close" onClick={handleCloseModal}>
//                 &times;
//               </span>
//               <img
//                 src={`https://logos-annex-qualifying-bob.trycloudflare.com/${product.image}`}
//                 alt={product.title}
//                 className="modal-image"
//               />
//             </div>
//           </div>
//         )}

//         <h2 className="product-price">₹{product.price}</h2>
//         <p className="product-description">{product.description}</p>
//         <p className="product-category">
//           <strong>Category: </strong>
//           {product.category}
//         </p>
//         <p className="added-by">
//           <strong>Added by: </strong>
//           {product.userId?.email || "Unknown"}
//         </p>

//         <br />
//         <Link to="/cart">
//           <button
//             className="back-button"
//             onClick={() => {
//               addtoCart(product._id);
//             }}
//           >
//             Add To Cart
//           </button>
//         </Link>

//         <div className="reviews">
//           <h3>Customer Reviews</h3>
//           <p style={{ backgroundColor: "darkgray", color: "white" }}>
//             Average Rating:
//             {Array.from(
//               { length: Math.round(product.avgRating) },
//               (_, i) => "⭐"
//             ).join("")}
//           </p>{" "}
//           {reviews.length > 0 ? (
//             reviews.map((review) => (
//               <div className="review" key={review._id}>
//                 <strong>{review.userId?.email}</strong>
//                 <p>
//                   Rating:
//                   {Array.from(
//                     { length: Math.round(review.rating) },
//                     (_, i) => "⭐"
//                   ).join("")}{" "}
//                 </p>
//                 <p>{review.reviewText}</p>
//               </div>
//             ))
//           ) : (
//             <p>No reviews yet. Be the first to review this product!</p>
//           )}
//           <form onSubmit={(e) => e.preventDefault()} className="review-form">
//             <h4>Write a Review</h4>
//             <label htmlFor="rating">Rating</label>
//             <select
//               id="rating"
//               value={rating}
//               onChange={(e) => setRating(parseInt(e.target.value))}
//             >
//               <option value="1">1 Star</option>
//               <option value="2">2 Stars</option>
//               <option value="3">3 Stars</option>
//               <option value="4">4 Stars</option>
//               <option value="5">5 Stars</option>
//             </select>

//             <label htmlFor="reviewText">Review</label>
//             <textarea
//               id="reviewText"
//               value={reviewText}
//               onChange={(e) => setReviewText(e.target.value)}
//             ></textarea>

//             <button
//               type="button"
//               disabled={reviewText.length === 0}
//               onClick={handleSubmitReview}
//             >
//               Submit Review
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./header";
import "./css/detail.css";

export default function DetailView() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch(
          `https://logos-annex-qualifying-bob.trycloudflare.com/detail/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const productData = await res.json();
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch(
          `https://logos-annex-qualifying-bob.trycloudflare.com/${id}/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [id, reviews]);

  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("authToken");
    try {
      await fetch(
        `https://logos-annex-qualifying-bob.trycloudflare.com/addtocart`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
        }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `https://logos-annex-qualifying-bob.trycloudflare.com/${id}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, reviewText }),
        }
      );

      const data = await res.json();

      setReviews(data.reviews || []);
      setReviewText("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleImageClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Header />
      <div className="detail-view-container">
        <h1 className="product-title">{product.title}</h1>
        <img
          src={`https://logos-annex-qualifying-bob.trycloudflare.com/${product.image}`}
          alt={product.title}
          className="product-image"
          onClick={handleImageClick}
        />

        {isModalOpen && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <img
                src={`https://logos-annex-qualifying-bob.trycloudflare.com/${product.image}`}
                alt={product.title}
                className="modal-image"
              />
            </div>
          </div>
        )}

        <h2 className="product-price">₹{product.price}</h2>
        <p className="product-description">{product.description}</p>
        <p className="product-category">
          <strong>Category: </strong>
          {product.category}
        </p>
        <p className="added-by">
          <strong>Added by: </strong>
          {product.userId?.email || "Unknown"}
        </p>

        <br />
        <Link to="/cart">
          <button
            className="back-button"
            onClick={() => addToCart(product._id)}
          >
            Add To Cart
          </button>
        </Link>

        <div className="reviews">
          <h3>Customer Reviews</h3>
          <p style={{ backgroundColor: "darkgray", color: "white" }}>
            Average Rating:
            {Array.from(
              { length: Math.round(product.avgRating) },
              () => "⭐"
            ).join("")}
          </p>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review" key={review._id}>
                <strong>
                  {
                    review.userId?.email
                      .split("@")[0]
                      .replace(/[0-9]/g, "")
                      .split(".")[0]
                      .split(/[0-9]+/)[0]
                  }
                </strong>
                <p>
                  Rating:
                  {Array.from(
                    { length: Math.round(review.rating) },
                    () => "⭐"
                  ).join("")}
                </p>
                <p>{review.reviewText}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="review-form">
            <h4>Write a Review</h4>
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "star selected" : "star"}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

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
