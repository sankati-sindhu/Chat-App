const express = require('express')
const router = express.Router();
const Message = require('../models/message')

//new message
router.post("/", async (req, res) => {
    // console.log(req.body.senderid, req.body.recvId);
    const newMessage = new Message(req.body);
    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }catch(err){
        res.status(500).json(err);
    }
})

//get messages
router.get('/:conversationId', async (req, res) => {
    // console.log(req.body.senderid, req.body.recvId);
    try{
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json(err);
    }
});
module.exports = router;

