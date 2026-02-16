import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

export interface CurrentUser {
  userId: string;   // Cognito sub (stable ID)
  email: string;    // email from Cognito
  username?: string;
  name?: string;
}

export const getCurrentUserInfo = async (): Promise<CurrentUser> => {
  try {
    const user = await getCurrentUser(); // { username, userId, signInDetails }
    const attributes = await fetchUserAttributes(); // { sub, email, name, ... }

    return {
      userId: attributes.sub || user.userId || user.username, // best effort
      email: attributes.email || user.signInDetails?.loginId || '',
      username: user.username,
      name: attributes.name || user.username
    };
  } catch (error) {
    throw new Error("No authenticated user");
  }
};
