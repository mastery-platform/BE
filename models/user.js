const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

// ** Hash password before saving **
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    console.log("Hashing new password for:", this.email); // ✅ Debug log

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    console.log("Hashed Password:", this.password); // ✅ Debug log
    next();
});


// ** Rehash password when updating profile **
userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.password) {  // If password is being updated
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
    }
    next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
