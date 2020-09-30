import { Schema } from 'mongoose';

export const hospitalSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String },
    creator: { ref: 'User', type: Schema.Types.ObjectId }
})