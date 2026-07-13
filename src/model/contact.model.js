import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
    },
    linkedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
    linkPrecedence: {
      type: String,
      enum: ["primary", "secondary"],
      default: "primary",
    },
  },
  { timestamps: true },
);
export const Contact = mongoose.model("Contact", contactSchema);
