import authenticate from './middleware/authMiddleware';
import { NextResponse } from 'next/server';
import connectToDatabase from './utils/db.mjs';
import user from './models/user';

const config = {
    global: [
        '/api/login',
        '/api/customer/register'
    ],
    restricted: [
        {
            route: 'customer/.*',
            access: ['admin']
        }
    ]
};

export async function middleware(req) {
    const url = req.nextUrl.pathname;

    // Check if the route matches any global routes
    if (config.global.includes(url)) {
        return NextResponse.next();
    }

    // Authenticate the user for non-global routes
    const authResult = await authenticate(req);
    if (authResult instanceof Response) {
        return authResult; // Return error response from authentication
    }

    // Extract the user from the request (attached during authentication)
    const userHeader = req.headers.get('X-User');
    if (!userHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const userParseHeader = JSON.parse(userHeader);
    await connectToDatabase();
    const userData = await user.findById(userParseHeader._id);
    if (!userData) {
        return new Response(JSON.stringify({ error: 'Cannot find user' }), { status: 401 });
    }

    
    for (const restrictedRoute of config.restricted) {
        const { route, access } = restrictedRoute;

        // Check if the URL matches the restricted route pattern
        const routePattern = new RegExp(`^/api/${route}$`);
        if (routePattern.test(url)) {
            // Ensure the user has the required access role
            console.log(userData,userType,access);
            if (!access.includes(userData.userType)) {
                return new Response(
                    JSON.stringify({ error: 'Forbidden: Insufficient permissions' }),
                    { status: 403 }
                );
            }
        }
    }

    // If no restrictions are matched or passed, allow the request
    return NextResponse.next();
}
