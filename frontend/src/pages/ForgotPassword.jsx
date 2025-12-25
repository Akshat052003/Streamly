import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../lib/api'
import toast from 'react-hot-toast'
import VideoCall from '../../public/video1.png'

const ForgotPassword = () => {
    const [email, setEmail] = useState()
    const navigate = useNavigate()
    const {mutate : forgotPasswordMutation , isPending} = useMutation({
        mutationFn: forgotPassword(),
        onSuccess : (data) => {
            toast.success(data.message || "OTP sent to your email")
            navigate("/verify-otp", {state : {email}})
        }, 
        onError : (error) => {
            toast.error(error?.response?.data?.message || "Failed to send OTP, please try again")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!email){
            toast.error("Please enter your email")
            return
        }
        forgotPasswordMutation(email)

    }
  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <Video className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamly
            </span>
          </div>

          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold">Forgot Password?</h2>
                  <p className="text-sm opacity-70">
                    No worries! Enter your email and we'll send you an OTP to reset your password
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                  <div className="form-control w-full space-y-2 mb-2">
                    <label className="label text-white pl-2">
                      <span className="label-text">Email</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-60" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        className="input input-bordered w-full pl-10"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-full mt-4"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <Link
                      to="/login"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="size-4" />
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Image section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto bg-none">
              <img
                src={VideoCall}
                alt="Video Illustration"
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Secure Account Recovery</h2>
              <p className="opacity-70">
                We'll help you regain access to your account safely and securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword