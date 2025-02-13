import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./header";
import "./css/orderDetail.css";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = () => {
      const token = localStorage.getItem("authToken");

      fetch(
        `https://believed-holder-univ-direction.trycloudflare.com/order-detail/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => setOrder(data))
        .catch((err) => console.log(err));
    };

    fetchOrderDetail();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <h1 className="order-title">Order Details</h1>
      <div className="order-detail">
        <h3>Order ID: {order._id}</h3>
        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        <h4 className="payment-status">
          Payment Status: {order.paymentStatus}
        </h4>

        <ul className="order-products">
          {order.products.map((item, index) => (
            <li key={index} className="product-item">
              <img
                src={`https://believed-holder-univ-direction.trycloudflare.com/${item.product.image}`}
                alt={item.product.title}
                width="80"
              />
              <div>
                <h3>{item.product.title}</h3>
                <p>{item.product.description}</p>
                <p>
                  Price: ₹{item.product.price} x {item.quantity}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
