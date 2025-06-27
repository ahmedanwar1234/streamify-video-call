import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signUp(req, res) {
  const { email, password, fullName } = req.body;

  try {
    // 1. تحقق من المدخلات
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  console.log("❌ Invalid email");
} else {
  console.log("✅ Valid email");
}


    // 2. تأكد إن المستخدم مش موجود قبل كده
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }


    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // 4. إنشاء مستخدم جديد
    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic:randomAvatar
    });

// TODO : CREATE THE USER IN STREAM AS WELL
try {
  await upsertStreamUser({
  id:newUser._id.toString(),name:newUser.fullName,image:newUser.profilePic || ""
})
  console.log(`Stream user created for ${newUser.fullName}`)
} catch (error) {
  console.log("Error createing Stream user",error)
}

    // 5. إنشاء توكن JWT
    const token = jwt.sign({ id: newUser._id }, "SECRET_KEY", {
      expiresIn: "7d",
    });

    // 6. الرد بالبيانات
    res.cookie("jwt",token,{
         maxeAge: 7*24*60*1000,
         sameSite:"strict",
         secure:process.env.NODE_ENV==="production",
        httpOnly:true
        });
        res.status(201).json({success:true,user:newUser})
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}



export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // 1. تأكد من المدخلات
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. دور على المستخدم في قاعدة البيانات
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. قارن الباسورد مع النسخة المشفرة في الداتا
    const isPasswordCorrect= await user.matchPassword(password)
if(!isPasswordCorrect)
  return res.status(401).json({message:"Invalid password"})

      // 5. إنشاء توكن JWT
    const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
      expiresIn: "7d",
    });

    // 6. الرد بالبيانات
    res.cookie("jwt",token,{
         maxeAge: 7*24*60*1000,
         sameSite:"strict",
         secure:process.env.NODE_ENV==="production",
        httpOnly:true
        });

    // 5. رجّع التوكن للمستخدم
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}


export async function logout(req,res){



    res.clearCookie("jwt")
    res.status(200).json({sucess:true,message:"Logout Succefully"})
    
}


export async function onboard(req,res){
try {
  const userId = req.user._id;



  const {fullName,bio,nativeLanguage,learningLanguage,location }=req.body
if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
  return res.status(400).json({ message: "All fields are required" ,missingFields:[   !fullName && "fullName",
    !bio && "bio",
    !nativeLanguage && "nativeLanguage",
    !learningLanguage && "learningLanguage",
    !location && "location"].filter(Boolean)});
}
const updateUser=await User.findByIdAndUpdate(userId,{
 ...req.body,isOnboarded:true
},{new:true})

if(!updateUser) return res.status(400).json({message:"User not found"})
  /// TODO : UPDATE THE USER INFO IN STREAM
try {
  
  await upsertStreamUser({
    id:updateUser._id.toString(),
    name:updateUser.fullName,
    image:updateUser.profilePic || ""
  })
  console.log(`Stream user updated after onboarding for ${updateUser.fullName}`)
} catch (streamError) {
  console.log("Error updating Stream user during onboarding")
  
}
  res.status(200).json({success:true,user:updateUser})

} catch (error) {
return res.status(500).json({message:"Internal Server Error"})
}
}