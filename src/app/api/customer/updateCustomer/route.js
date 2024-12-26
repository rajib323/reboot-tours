import connectToDatabase from '../../../../utils/db.mjs';
import user from '../../../../models/user';

export async function PUT(req) {
  await connectToDatabase();
  const body = await req.json();
  const userHeader = req.headers.get('X-User');
  if (!userHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const userParseHeader = JSON.parse(userHeader);

  const { _id: id } = userParseHeader;
  const { ...updateData } = body;
  try {
    const updatedUser = await user.findOneAndUpdate({_id:id,userType:"customer"}, updateData, { new: true });
    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

