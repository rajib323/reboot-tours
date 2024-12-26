import connectToDatabase from '../../../../utils/db.mjs';
import user from '../../../../models/user';

export async function GET(req) {
  await connectToDatabase();
  try {
    const userHeader = req.headers.get('X-User');
    if (!userHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const Users = await user.find({userType:"customer"});
    return new Response(JSON.stringify({message:"All Users fetched successfully",data:Users}), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
