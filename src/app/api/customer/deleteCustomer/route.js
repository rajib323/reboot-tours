import connectToDatabase from '../../../../utils/db.mjs';
import user from '../../../../models/user';

export async function DELETE(req) {
  await connectToDatabase();

  const userHeader = req.headers.get('X-User');
  if (!userHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const userParseHeader = JSON.parse(userHeader);
  const { _id: id } = userParseHeader;

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
  }

  try {
    const deletedUser = await user.findOneAndUpdate({_id:id,userType:"customer"},{isBlocked:true});
    if (!deletedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
