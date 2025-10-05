import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const paymentSchema = new Schema({
    paymentId: { type: String },
    amount: { type: Number },
    method: { type: String },
    date: { type: Date },
  }, { _id: false });
  
  const userSchema = new mongoose.Schema({
    // --- Authentication ---
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  
    // --- Profile Details ---
    name: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Others"] },
    occupationType: { type: String, enum: ["Govt", "Private", "Business"] },
    occupation: { type: String },
    height: { type: String },
    profilePhoto: { type: String }, // Cloudinary URL
    education: { type: String }, // city + type in one string
    languagesKnown: [{ type: String }], // simplified array field
    fathersName: { type: String },
    fathersOccupation: { type: String },
    mothersName: { type: String },
    mothersOccupation: { type: String },
    residentCountry: { type: String },
    currentCity: { type: String },
    hometown: { type: String },
    interests: [{ type: String }], // simplified array field
    disabilities: { type: String },
    futurePlans: { type: String },
    aboutMyself: { type: String },
    foodPreference: {
      type: String,
      enum: ["Vegetarian", "Eggetarian", "Non-Veg"],
    },
    gotra: { type: String },
    phoneNumber: { type: String },
    extraPhotos: [{ type: String }], // Cloudinary URLs
    payment: paymentSchema,
    isPaymentDone: { type: Boolean, default: false },
  
  }, { timestamps: true });

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.JWT_TOKEN,
        {
            expiresIn: "7d"
        }
    )
}

export const User=mongoose.model("User",userSchema);