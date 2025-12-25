import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    learningLanguage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    resetPasswordOtp : {
        type: String,
        default : null
    },
    resetPasswordOtpExpires : {
        type : Date,
        default : null
    }
}, { timestamps: true });

// Pre-save hook for hashing password
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordMatched = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordMatched;
    
}

userSchema.methods.generateOTP = async () => {
    const otp = Math.floor(10000 + Math.random() * 900000).toString()
    this.resetPasswordOtp = otp
    this.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000
    return otp
}

userSchema.methods.verifyOTP = async (otp) => {
    if(!this.resetPasswordOtp || !this.resetPasswordOtpExpires){
        return false
    }
    if(Date.now() > this.resetPasswordOtpExpires){
        return false;
    }
    return this.resetPasswordOtp === otp;

}

userSchema.methods.clearOTP = () => {
    this.resetPasswordOtp = null
    this.resetPasswordOtpExpires = null
}

const User = mongoose.model("User", userSchema);
export default User;
