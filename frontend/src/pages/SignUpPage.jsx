import React from 'react'
import { useState } from 'react'
import {ShipWheelIcon}from "lucide-react"
import { Link, Navigate, useNavigate } from 'react-router'
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {axiosInstance}from"../lib/axios.js"
import { signup } from '../lib/api.js'
import { useThemeStore } from '../store/useThemeStore.js'
const SignUpPage = () => {
  const navigate=useNavigate()
  const {theme}=useThemeStore()

    const [signupData,setSignUpData]=useState({
        fullName:"",
        email:"",
        password:""
    })
    const queryCLient=useQueryClient()

const {mutate:signupMutation,isPending,error}=useMutation({
  mutationFn:signup,
  onSuccess:()=>{queryCLient.invalidateQueries({queryKey:"authUser"})

}
})
    const handleSignup=(e)=>{
        e.preventDefault()

        signupMutation(signupData)
    }



  return (
    <div className=' h-screen flex items-center justify-center p4 sm:p-6 md:p8 ' data-theme={theme}>
      <div className=' border border-primary/25 flex flex-col  lg:flex-row w-full max-w-5xl  mx-auto bg-base-100
       rounded-xl shadow-lg overflow-hidden'>
{/* sign up form left side */}

<div className=' w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
{/* logo */}
<div className=' mb-4 flex  items-center justify-normal gap-2'>

<ShipWheelIcon className="w-9 h-9 text-primary"/>
<span className=' text-3xl font-bold font-mono bg-clip-text text-transparent  bg-gradient-to-r from-primary to-secondary tracking-wider '>Streamify</span>
</div>
{/* Error message if any */}
{error &&(<div className=' alert alert-error mb-4'>
  <span>{error.response.data.message}</span>
</div>)}


<div className=' w-full'>
  <form onSubmit={handleSignup}>
<div className=' space-y-4'>
<div >
  <h2 className=' text-xl font-semibold'> Create an Account</h2>
  <p className=' text-sm opacity-70'>
    Join Steramify and start your language learning adventure
  </p>
</div>

<div className=' space-y-3'>

{/* full name */}
<div className=' form-control w-full'>
<label htmlFor="" className='label'>

  <span className=' label-text'>Full Name</span>
</label>
<input type="text" placeholder='Ahmed Anwar' className=' input input-bordered w-full' value={signupData.fullName} required onChange={(e)=>{setSignUpData({...signupData,fullName:e.target.value})}} />
</div>
{/* email */}
<div className=' form-control w-full'>
<label htmlFor="" className='label'>

  <span className=' label-text'>Email</span>
</label>
<input type="email" placeholder='anwar@gmail.com' className=' input input-bordered w-full' value={signupData.email} onChange={(e)=>{setSignUpData({...signupData,email:e.target.value})}} />
</div>
{/* password */}
<div className=' form-control w-full'>
<label htmlFor="" className='label'>

  <span className=' label-text'>Full Name</span>
</label>
<input type="password" placeholder='************' className=' input input-bordered w-full' value={signupData.password} onChange={(e)=>{setSignUpData({...signupData,password:e.target.value})}} />
<p>Password must be at least 6 characters long</p>

</div>

<div className=' form-control w-full'>
<label htmlFor="" className='label cursor-pointer justify-normal gap-2'>
<input type="checkbox" className=' checkbox checkbox-sm' required />

  <span className=' text-xs leading-tight'>I agree to the {" "}


    <span className=' text-primary  hover:underline'>terms of service</span> and {" "}
        <span className=' text-primary  hover:underline'>privacy policy</span> and 

    
  </span>
  
</label>
</div>






</div>

<button className=' btn btn-primary w-full ' type='submit'>{isPending ? <><span className=' loading loading-spinner loading-xs'></span> Loading...</>:"Create Account"}</button>

<div className=' text-center mt-4'>
<p>Already have an account?{" "} <Link to="/login" className=" text-primary hover:underline">Sign in</Link></p>
</div>
</div>


  </form>
  
  </div>
  </div>
{/* Right side */}
{/* SIGNUP FORM – RIGHT SIDE */}
<div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
  <div className="max-w-md p-8">
    {/* Illustration */}
    <div className="relative aspect-square max-w-sm mx-auto">
      <img src="/Video call-bro.png" alt="Language connection illustration" className="w-full h-full" />
    </div>

    <div className="text-center space-y-3 mt-6">
      <h2 className="text-xl font-semibold">
        Connect with language partners worldwide
      </h2>
      <p className="opacity-70">
        Practice conversations, make friends, and improve your language skills together
      </p>
    </div>
  </div>
</div>


      </div>
    </div>
  )
}

export default SignUpPage
