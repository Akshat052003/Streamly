import { axiosInstance } from "./axios";

export const signUp = async (signUpData) => {
  const response = await axiosInstance.post("/auth/signup", signUpData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", {email})
  return response.data
}


export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser controller", error.message);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const getOutgoingFriendRequests = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data;
};

export const getStreamToken = async () => {
    const res = await axiosInstance.get("/chat/token")
    return res.data
}
