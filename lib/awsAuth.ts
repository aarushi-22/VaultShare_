// lib/awsAuth.ts
import { Amplify } from 'aws-amplify';

// Simple configuration without OAuth (no domain needed)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
    }
  }
});

// Export all auth functions we need
// lib/awsAuth.ts
export { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser,
  confirmSignUp,
  resendSignUpCode,
  fetchUserAttributes
} from "aws-amplify/auth";
