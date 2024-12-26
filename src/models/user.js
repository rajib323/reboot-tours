import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  address: { type: String },
  passportDetails: { type: String },
  password: { type: String, required: true },
  country: { type: String },
  isBlocked:{ type: Boolean, default:false },
  userType: {
    type: String,
    enum: ['employee', 'agent', 'customer','subagent','partner','admin'], // Allowed values
    required: true,
    default:'customer'
  },
  isActive: { type: Boolean, default: true, required: true }, // Boolean field
  bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  redeemedCoupons: [{ type: String }],
  walletBalance: { type: Number, default: 0 },
  subAgents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  performanceStats: { type: Object },
  
}, { timestamps: true });


const user = mongoose.models?.User || mongoose.model('User', UserSchema);
export default user;