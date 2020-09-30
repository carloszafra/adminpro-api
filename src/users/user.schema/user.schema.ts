import { Schema } from 'mongoose';
import { hash, compare, genSalt} from 'bcrypt';

export const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    img: { type: String, default: null},
    role: { type: String, required: true, default: 'USER_ROLE'},
    google: { type: Boolean, default: false},
    timestamp: { type: Date, default: Date.now }
})

userSchema.methods.hashPassword = async ( password: string ): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
} 

userSchema.methods.comparePasswords = async function ( password: string ): Promise<boolean> {
    return await compare( password, this.password );
}
