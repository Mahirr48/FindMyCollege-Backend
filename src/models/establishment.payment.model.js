// import mongoose from "mongoose";

// const establishmentPaymentSchema = new mongoose.Schema(
//   {
//     establishment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "EstablishmentStudent", // student under this establishment
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     method: {
//       type: String,
//       enum: ["Cash", "UPI", "Card", "Bank"],
//       default: "Cash",
//     },

//     txnId: {
//       type: String,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model(
//   "EstablishmentPayment",
//   establishmentPaymentSchema
// );


///////////////////////////////////////////////////////////


import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  method: {
    type: String,
    enum: ["Cash", "UPI", "Card", "Bank"],
    default: "Cash",
  },

  receiptNo: {
    type: String,
    unique: true,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", paymentSchema);
