import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },

    displayName: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, trim: true },

    passwordHash: { type: String, required: true },

    role: { type: String, default: "member" },

    sessionToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.sessionToken;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
