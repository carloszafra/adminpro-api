import { Schema } from 'mongoose';

export const doctorSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String },
    creator: { ref: 'User', type: Schema.Types.ObjectId },
    hospital: { ref: 'Hospital', type: Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now }
})