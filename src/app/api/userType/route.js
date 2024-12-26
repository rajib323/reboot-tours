import { NextResponse } from 'next/server';
import user from '../models/user'; // Replace with the correct path to your User model
import connectToDatabase from '../utils/db'; // Replace with your database connection utility

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the X-User header
    const userHeader = req.headers.get('X-User');
    if (!userHeader) {
      throw new Error('X-User header is missing');
    }

    // Parse the header to extract user information
    const user = JSON.parse(userHeader);

    if (!user._id) {
      throw new Error('User ID is missing in X-User header');
    }

    // Query the database for the user
    const userData = await user.findById(user._id);
    if (!userData) {
      throw new Error('User not found');
    }

    // Return the user type
    return {userType:userData.userType}; // Assuming `userType` is the field storing the type
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }),
    { status: 400 })
  }
}
