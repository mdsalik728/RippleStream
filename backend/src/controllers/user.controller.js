import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";


export async function getRecommendedUsers(req,res){

    try{
        const currentUserId=req.User.id;
        const currentUser=await User.findById(currentUserId);
        const recommendedUsers=await User.find({
            $and:[
                { _id: {$ne: currentUserId}}, //exclude current user
                { $id:{$nin: currentUser.friends}  //exclude current User's friends
                },
                {isOnboarded: true}
            ]

            
        })
        res.status(200).json(recommendedUsers)
    }catch(error){
        console.error("Error in getRecommendedUsers controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}
export async function getMyFriends(req,res){
    try{
        const user=await User.findById(req.user.id).select("friends")
        .populate("friends","fullName profilePic natuveLanguage learningLanguage");
        res.status(200).json(user.friends);
    }catch(error){
        console.error("Error in getMyFriends controller",error.message);
        res.status(500).json({message: "Internal Server Error"});

    }

}

export async function sendFriendRequest(req,res){

    try{
        const myId=req.user.id;
        const{id:recipientId}=req.params;
        //prevent sending to ourselves
        if(myId === recipientId){
            return res.status(400).json({message:"you cant send request to yourself"});
        }

        const recipient=await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"Recipient not found"});
        }
         

        //check if user is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"});
        }

        //check if request already exists
        const existingRequest=await FriendRequest.findOne({
            $or:[
                {
                    sender:myId,recipient:recipientId

                },
                {
                    sender: recipientId,sender:myId
                }


            ],
        });
        if(existingRequest){
            return res.status(400).json({message:" A friend request already exists between you and this user"});
        }
        const friendRequest=await FriendRequest.create({
            sender:myId,
            recipient: recipientId,
        });
        res.status(201).json(friendRequest);
    }catch(error){
        console.error("Error in sendFriendRequest controller",error.message);
        res.status(500).json({message:"Internal Server Error"});

    }

}

export async function acceptFriendRequest(req,res){
    try{
        const {id:requestId}=req.params;
        const friendRequest=await friendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }

        //verify that current user is recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message:" You are not authorized to accept this request"});
        }

        //accepting friend request
        friendRequest.status="accepted";
        await friendRequest.save();
        
        //add each user to the other's friends array

        //$addToSet adds element to an array only if they do not exist
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{
                friends: friendRequest.recipient
            },
            

        });
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{
                friends: friendRequest.sender
            },
        });
        res.status(200).json({message:"Friend request accepted"});

    }catch(error){
        console.log("Error in acceptFriendRequest controller",error.message);
        res.status(500).json({message:"Internal Server Error"});

    }
}

export async function  getFriendRequests(req,res){
    try{
        const incomingReqs= await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",

        }).populate("sender","fullName profilePic NativeLanguage learningLanguage");

        const acceptedReqs=await FriendRequest.find({
            sender: req.user.id,
            status:"accepted",
        }).populate("recipient"," fullName profilePic");
        res.status(200).json({incomingReqs,acceptedReqs});

    }catch(error){
        console.log("Error in getPendingFriendRequests controller",error.message);

    }

}
export async function getOutGoingFriendReqs(req,res){
    try{
        const outgoingReq=await FriendRequest.find({
            sender: req.user.id,
            status:"pending",

        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
    }catch(error){
        console.log("Error in getOutGoingFriendReqs controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}