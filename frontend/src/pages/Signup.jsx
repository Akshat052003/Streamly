import { Video } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import VideoImg from '../../public/video.jpg'
import VideoCall from "../../public/video1.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { signUp } from "../lib/api.js";

const Signup = () => {
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: signUpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation(signUpData);
  };
  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Signup form left part */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <Video className="size-9 text-primary/90" />
            <span className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary tracking-wider">
              Streamly
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create An Account</h2>
                  <p className="text-sm opacity-70">
                    Join Streamly and start your video call adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label py-2 text-white">
                      <span className="label-text">Full Name</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="input input-bordered w-full"
                      value={signUpData.fullName}
                      onChange={(e) => {
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label py-2 text-white">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input input-bordered w-full"
                      value={signUpData.email}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, email: e.target.value });
                      }}
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label py-2 text-white">
                      <span className="label-text">Password</span>
                    </label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        });
                      }}
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be atleast 6 characters long
                    </p>
                  </div>
                  <div className="form-control mt-5">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-3">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Signup right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto bg-none ">
              <img
                src={VideoCall}
                alt="Video Illustration"
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with various people worldwide
              </h2>
              <p className="opacity-70">
                Connect with people across the globe, make friends, and improve
                your personality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
