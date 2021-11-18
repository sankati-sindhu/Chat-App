const express = require('express');
const coversations = require('../models/coversations');
const router = express.Router();
const Coversations = require('../models/coversations')

//new conv
router.post("/", async (req, res) => {
    console.log(req.body.senderid, req.body.recvId);
    const newCoversation = new coversations({
        members:[req.body.senderid, req.body.recvId]
    });
    try{
        const savedCoversation = await newCoversation.save();
        res.status(200).json(savedCoversation);
    }catch(err){
        res.status(500).json(err);
    }
})
//getconv of a user
router.get('/:userid', async(req, res)=>{
    try{
        console.log('trying to get coversations', req.params.userid)
        const coversations = await Coversations.find({
            members: { $in: [req.params.userid]},
        });
        res.status(200).json(coversations);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;
