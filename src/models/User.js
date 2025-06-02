import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
     fistname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 12
    },
    profileImage: {
        type: String,
        default:""
    },
     bio: {
        type: String,
        default: "",
    },
     interests: {
        type: [String], // Ex: ['cafe', 'restau', 'bar']
        default: [],
    },
    instagram: {
        type: String, // nom d'utilisateur IG ou URL
        default: "",
    },
     balance: {
        type: Number,
        default: 0,
    },

}, {timestamps: true});

//hash password before saving user to db 
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next()
});

// compare password function
userSchema.methods.comparePassword = async function (userPassword) {

    return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;