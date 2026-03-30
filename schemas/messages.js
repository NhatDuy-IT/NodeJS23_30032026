const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  contentMessage: {
    type: {
      type: String,
      enum: ['text', 'file'],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);

