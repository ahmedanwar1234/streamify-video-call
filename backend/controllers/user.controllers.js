import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecomendedUsers(req,res){



    try {
        const currentUserId= req.user.id;
        const currentUser =req.user
        const recomendedUsers = await User.find({
            $and:[
                {_id:{$ne: currentUserId}},
                {_id:{$nin: currentUser.friends}},
                {isOnboarded:true}
            ]
        })

        res.status(200).json(recomendedUsers)
    } catch (error) {
        console.error("Error n geRecommededUsers controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function sendFriendRequest (req,res){

    try {
        const myId=req.user.id
        const {id}=req.params

        // prevent sending req to yourself
        if(myId=== id){
            return res.status(400).json({message:"You cant send friend request to yourself"})
        }

        const recipient=await User.findById(id)
        if(!recipient){
            return res.status(400).json({message:"Recipient not found"})
        }
 
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"})
        }

        const existingRequest= await  FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:id},
                {
                    sender:id,recipient:myId
                }
            ]
        })
        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists between you and this user"})
        }
// id ==> recipientId
        const friendRequest= await FriendRequest.create({
            sender:myId,
    recipient:id
        }
        )
res.status(200).json(friendRequest)

    } catch (error) {
         console.log("Error in sendFriendRequest", error.message);
  res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function acceptRequest(req,res){
    try {

        const {id:requestId}=req.params

        const friendRequest= await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});

        }

        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message: "You are nto authorized to accept this request"})
        }
        friendRequest.status ="accepted"
        await friendRequest.save()
// add each user to the others friends araray

// $addToSet: ads elements to an array only if they dont already exists
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })
         await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })

        return res.status(200).json({message:"Friend request accepted"})
    } catch (error) {
        
        console.log("error in acceptFriendRequest controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}



export async function getFriendRequests(req,res) {
    try {
        const incomingReqs=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","FullName profilePic nativeLanguage learningLanguage")

        const acceptedReqs= await FriendRequest.find({
            recipient:req.user.id,
            status:"accpeted"
        }).populate("recipient","FullName profilePic ")

        res.status(200).json({incomingReqs,acceptedReqs})
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller",error.message)
        res.status(500).json({message:"Internal Server error"})
        
    }
}
export async function getOutgoingFriendReqs(req,res) {
    
    
    try {
       const outgoingFriendReq=await FriendRequest.find({sender:req.user.id,status:"pending"}).populate("recipient","fullName profilePic nativeLanguage learningLanguage")
    
       res.status(200).json(outgoingFriendReq)
   } catch (error) {
      console.log("Error in getOutgoingFriendRequests controller",error.message)
        res.status(500).json({message:"Internal Server error"})
        
   }
}