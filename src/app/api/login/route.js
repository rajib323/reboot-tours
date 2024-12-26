import connectToDatabase from '../../../utils/db.mjs';
import user from '../../../models/user';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../../utils/auth';

// Login Route Handler
export async function POST(req) {
  await connectToDatabase();
  
  const { email, password } = await req.json();  // Parsing incoming data from the request

  // Check if email and password are provided
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Email and password are required.' }),
      { status: 400 }
    );
  }

  try {
    // Find the User by email
    const User = await user.findOne({ email,isBlocked:false });
    if (!User) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password.' }),
        { status: 401 }
      );
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, User.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password.' }),
        { status: 401 }
      );
    }

    // Generate JWT Access and Refresh Tokens
    const accessToken = await generateAccessToken(User);
    const refreshToken = await generateRefreshToken(User);

    console.log(accessToken,refreshToken);
    // Return the tokens along with userType and user _id
    return new Response(
      JSON.stringify({
        accessToken,
        refreshToken,
        userType: User.userType,
        _id: User._id
      }),
      { status: 200 }
    );

  } catch (error) {
    // Handle any errors that occurred during login
    return new Response(
      JSON.stringify({ error: 'An error occurred during login. Please try again.' }),
      { status: 500 }
    );
  }
}
