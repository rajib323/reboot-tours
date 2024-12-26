import mongoose from 'mongoose';



// models/Booking.js
const BookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPlan', required: true },
    paymentStatus: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now },
  }, { timestamps: true });
  
  const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
  export default Booking;