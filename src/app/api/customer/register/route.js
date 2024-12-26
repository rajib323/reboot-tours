import connectToDatabase from '../../../../utils/db.mjs';
import user from '../../../../models/user';
import Joi from 'joi';
import bcrypt from 'bcrypt';

// Joi validation schema
const UserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(8).required(),
});

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  const { error } = UserSchema.validate(body,{ stripUnknown: true });
  if (error) {
    return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const User = new user({ ...body, password: hashedPassword });
    await User.save();
    return new Response(JSON.stringify(User), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
