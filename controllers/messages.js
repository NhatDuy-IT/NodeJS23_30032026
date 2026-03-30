const messageModel = require("../schemas/messages");
const userModel = require("../schemas/users");

module.exports = {
  getMessagesWithUser: async function(currentUserId, targetUserId) {
    return await messageModel
      .find({
        $or: [
          { from: currentUserId, to: targetUserId, isDeleted: false },
          { from: targetUserId, to: currentUserId, isDeleted: false }
        ]
      })
      .sort({ createdAt: 1 })
      .populate('from', 'username email')
      .populate('to', 'username email');
  },

  sendMessage: async function(currentUserId, toUserId, type, content) {
    const toUser = await userModel.findOne({ _id: toUserId, isDeleted: false });
    if (!toUser) throw new Error("Target user not found");
    
    const newMessage = new messageModel({
      from: currentUserId,
      to: toUserId,
      contentMessage: { type, content }
    });
    await newMessage.save();
    await newMessage.populate('from to');
    return newMessage;
  },

  getLatestConversations: async function(currentUserId) {
    const pipeline = [
      { $match: {
        $or: [
          { from: currentUserId, isDeleted: false },
          { to: currentUserId, isDeleted: false }
        ]
      }},
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: {
          otherUser: { $cond: [{ $eq: ["$from", currentUserId] }, "$to", "$from"] }
        },
        latestMessage: { $first: "$$ROOT" }
      }},
      { $lookup: {
        from: "users",
        localField: "_id.otherUser",
        foreignField: "_id",
        as: "otherUser"
      }},
      { $unwind: "$otherUser" },
      { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT.latestMessage", { otherUser: "$otherUser" }] } } },
      { $project: { _id: 0, otherUser: { username: 1, email: 1 }, contentMessage: 1, createdAt: 1 } }
    ];
    
    return await messageModel.aggregate(pipeline);
  }
};

