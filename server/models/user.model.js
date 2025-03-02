import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    projects: {
        type: [
            {
                name: { type: String, required: true },
                items: [
                    {
                        name: { type: String, required: true },
                        url: { type: String, required: true },
                        frequency: { type: Number, required: true, min: 0 }
                    }
                ]
            }
        ],
        default: [],
    }, 
    createdAt: { type: Date, default: Date.now },
}, { minimize: false });

const User = mongoose.model('User', userSchema);
export default User;