var express = require("express");
var router = express.Router();
let messageController = require("../controllers/messages");
let { checkLogin } = require("../utils/authHandler");
const { uploadImage } = require("../utils/uploadHandler");
let userModel = require("../schemas/users");
let mongoose = require("mongoose");

// GET /messages/:userID - all messages with userID
router.get("/:userID", checkLogin, async function(req, res, next) {
  try {
    const messages = await messageController.getMessagesWithUser(req.userId, req.params.userID);
    res.send(messages);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// POST /messages - send message (multipart for file)
router.post("/", checkLogin, uploadImage.single("file"), async function(req, res, next) {
  try {
    const { to } = req.body;
    let type = "text";
    let content = req.body.content;

    if (req.file) {
      type = "file";
      content = `/uploads/${req.file.filename}`;  // URL
    }

    const message = await messageController.sendMessage(
      req.userId, 
      to, 
      type, 
      content
    );
    res.send(message);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET /messages - latest per conversation
router.get("/", checkLogin, async function(req, res, next) {
  try {
    const convos = await messageController.getLatestConversations(req.userId);
    res.send(convos);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;

