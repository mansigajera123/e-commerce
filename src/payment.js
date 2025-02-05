import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutform";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51QgjlSL56fvSGhWQEv39EkKrkPYPbmXp9xzDB5HPHB2LjLE0ekhxYKoZT9z78LRTZGUutspuJ1qTRYhIzg12Xj9c00NOJckrw0"
);

export default function Payment() {
  const location = useLocation();
  const { totalPrice } = location.state || {};
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={totalPrice} />
    </Elements>
  );
}
