import { Session } from "next-auth"

export interface SessionWithSubscription extends Session {
  userSubscription: unknown
}