import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeClient } from "../../services/stripe-client";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.userSubscription) {
      router.push("/posts");
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
