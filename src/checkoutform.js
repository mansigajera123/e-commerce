import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import "./checkoutForm.css";
import { useNavigate } from "react-router-dom";

function CheckoutForm({ amount }) {
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setPaymentProcessing(true);

    const response = await fetch(
      `https://pink-places-build.loca.lt/payment-intent`,
      {
        method: "POST",
        body: JSON.stringify({ amount }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const clientSecret = data.clientSecret;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: "Customer Name",
          },
        },
      }
    );

    if (error) {
      console.log(error.message);
      setPaymentProcessing(false);
    } else {
      if (paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        setPaymentProcessing(false);
        navigate("/cart", { state: { message: "payment successful" } });
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Card Number</label>
          <CardNumberElement className="card-element" />
        </div>
        <div className="form-field">
          <label>Expiration Date</label>
          <CardExpiryElement className="card-element" />
        </div>
        <div className="form-field">
          <label>CVV</label>
          <CardCvcElement className="card-element" />
        </div>
        <button type="submit" disabled={!stripe || paymentProcessing}>
          {paymentProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
