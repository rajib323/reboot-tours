import { jwtVerify, SignJWT } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m'; // Default to 15 minutes if not defined
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'; // Default to 7 days if not defined

// Generate an Access Token
export const generateAccessToken = async (user) => {
  const encodedSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET); // Encode the secret into Uint8Array
  const token = await new SignJWT({ _id: user._id }) // The payload
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }) // Set the algorithm and token type
    .setIssuedAt() // Add the issued-at timestamp
    .setExpirationTime(ACCESS_TOKEN_EXPIRY) // Set expiration time (e.g., 15 minutes)
    .sign(encodedSecret); // Sign the token with the encoded secret
  return token; // Return the token as a string
};

// Generate a Refresh Token
export const generateRefreshToken = async (user) => {
  const encodedSecret = new TextEncoder().encode(REFRESH_TOKEN_SECRET); // Encode the secret into Uint8Array
  const token = await new SignJWT({ _id: user._id, isRefreshToken: true }) // The payload
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }) // Set the algorithm and token type
    .setIssuedAt() // Add the issued-at timestamp
    .setExpirationTime(REFRESH_TOKEN_EXPIRY) // Set expiration time (e.g., 7 days)
    .sign(encodedSecret); // Sign the token with the encoded secret
  
  return token; // Return the token as a string
};

// Verify Access Token
export const verifyAccessToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ACCESS_TOKEN_SECRET)); // Verify and decode the access token
    return payload; // Return the decoded payload
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

// Verify Refresh Token
export const verifyRefreshToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(REFRESH_TOKEN_SECRET)); // Verify and decode the refresh token
    return payload; // Return the decoded payload
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
