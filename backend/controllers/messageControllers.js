const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  //querying our database
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name profilePicture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePicture email",
    });

    //Giving the latestMessage the message value, replacing the old latest message with the old
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    //req.params since its inside our parameters
    //now we got our request object, now we populate it
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePicture email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = { sendMessage, allMessages };
