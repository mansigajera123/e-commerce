import { useEffect, useState } from "react";
import "./product.css";
import { Link } from "react-router-dom";
import Header from "./header";

export default function Product() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const getProduct = () => {
      const token = localStorage.getItem("authToken");
      fetch("https://pink-places-build.loca.lt/product/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((product) => {
          setProduct(product);
        })
        .catch((err) => console.log(err));
    };
    getProduct();
  }, []);

  const deleteProduct = (id) => {
    const token = localStorage.getItem("authToken");

    fetch(`https://pink-places-build.loca.lt/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(() => {
        setProduct((prevProduct) =>
          prevProduct.filter((item) => item._id !== id)
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div className="product-container">
        <h1>My Products</h1>
        <div className="product-list">
          {product.map((item) => (
            <div key={item._id} className="product-card">
              <img
                src={`https://pink-places-build.loca.lt/${item.image}`}
                alt={item.title}
                loading="lazy"
              />
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <div className="price">₹{item.price}</div>
              <button type="delete" onClick={() => deleteProduct(item._id)}>
                Delete
              </button>
              <br />
              <br />

              <Link to={`/edit/${item._id}`}>
                <button type="edit">Edit</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
