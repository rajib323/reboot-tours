import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from '../utils/auth';
import { NextResponse } from 'next/server';



const authenticate = async (req) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'Authentication token is required' }), { status: 400 });
    }

    const decoded = await verifyAccessToken(token);

    if (decoded.isRefreshToken) {
      return new NextResponse(JSON.stringify({ error: 'Invalid token type: Refresh token used where access token expected' }), { status: 400 });
    }

    console.log('Decoded:', decoded);

    // Add user info to headers
    req.headers.set('X-User', JSON.stringify(decoded));
    return;
  } catch (error) {
    const refreshToken = req.headers.get('RefreshToken')?.split(' ')[1];
    if (refreshToken) {
      try {
        const decodedRefresh = await verifyRefreshToken(refreshToken);
        const newAccessToken = await generateAccessToken({ _id: decodedRefresh._id });
        return new NextResponse(JSON.stringify({ error: 'Access token expired', accessToken: newAccessToken }), { status: 401 });
      } catch (refreshError) {
        return new NextResponse(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401 });
      }
    }
    return new NextResponse(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401 });
  }
};

export default authenticate;