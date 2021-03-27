import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeClient } from "../../services/stripe-client";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const res = await api.post("/subscribe");
      const { sessionId } = res.data;
      const stripe = await getStripeClient();
      await stripe.redirectToCheckout({ sessionId: sessionId });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.SubscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
