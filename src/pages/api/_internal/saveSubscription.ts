import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  insertNewRecord = false
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index("user_by_stripe_id"),
          customerId
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id
  }

  try {
    if(insertNewRecord) {
      await fauna.query(
        q.Create(
          q.Collection("subscriptions"),
          { data: subscriptionData }
        )
      )
    } else {
      await fauna.query(
        q.Replace(
          q.Select(
            "ref",
            q.Get(
              q.Match(
                q.Index("subscription_by_id"),
                subscriptionId
              )
            )
          ),
          { data: subscriptionData }
        )
      )
    }
  } catch (error) {
    console.log(error)
  }
}
