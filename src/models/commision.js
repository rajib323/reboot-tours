import mongoose from 'mongoose';


// models/Commission.js
const CommissionSchema = new mongoose.Schema({
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
  }, { timestamps: true });
  
  const Commission = mongoose.models.Commission || mongoose.model('Commission', CommissionSchema);
  export default Commission;