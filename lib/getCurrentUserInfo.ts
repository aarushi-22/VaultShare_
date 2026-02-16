// lib/getCurrentUserInfo.ts
import { getCurrentUser, fetchUserAttributes } from "./awsAuth";

export async function getCurrentUserInfo() {
  try {
    const user = await getCurrentUser(); // throws if not signed in
    const attrs = await fetchUserAttributes();

    return {
      email: attrs.email ?? null,
      username: user.username,
    };
  } catch (err) {
    console.error("Error getting current user:", err);
    return null; // safely return null if signed out
  }
}
