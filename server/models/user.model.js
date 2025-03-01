import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    projects: [
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
    ]
});

const User = mongoose.model('User', userSchema);
export default User;