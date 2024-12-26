import mongoose from 'mongoose';


// models/TourPlan.js
const TourPlanSchema = new mongoose.Schema({
    category: { type: String, required: true },
    itinerary: [{ day: Number, description: String }],
    price: { type: Number, required: true },
    availableSlots: { type: Number, required: true },
    totalSlots: { type: Number, required: true },
  }, { timestamps: true });
  
  const TourPlan = mongoose.models.TourPlan || mongoose.model('TourPlan', TourPlanSchema);
  export default TourPlan;