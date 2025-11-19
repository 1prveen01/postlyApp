import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

//Axios interceptors let you run code automatically before or after every request or response.
axiosInstance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Login
export const login = async (credentials: {
  email?: string;
  username?: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/users/login", credentials);
  return response.data;
};

// Register
export const register = async (userData: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar: File;
}) => {
  // formData for file upload
  const formData = new FormData();
  formData.append("fullName", userData.fullName);
  formData.append("username", userData.username);
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  formData.append("avatar", userData.avatar); // File upload

  const response = await axiosInstance.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/users/current-user");
  return response.data;
};

// Change password
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confPassword: string;
}) => {
  const response = await axiosInstance.post("/users/change-password", data);
  return response.data;
};

// Update account details
export const updateAccount = async (data: {
  fullName: string;
  email: string;
}) => {
  const response = await axiosInstance.patch("/users/update-account", data);
  return response.data;
};

// Update avatar
export const updateAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  const response = await axiosInstance.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};



// Get user tweets
export const getUserTweets = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`/tweets/get-user-tweets?page=${page}&limit=${limit}`);
  return response.data;
};


// Create a new tweet
export const createTweet = async (content: string) => {
  const response = await axiosInstance.post("/tweets/create-tweet", { content });
  return response.data;
};

// Update a tweet
export const updateTweet = async (tweetId: string, content: string) => {
  const response = await axiosInstance.patch(`/tweets/update-tweet/${tweetId}`, { content });
  return response.data;
};

// Delete a tweet
export const deleteTweet = async (tweetId: string) => {
  const response = await axiosInstance.delete(`/tweets/delete-tweet/${tweetId}`);
  return response.data;
};

export const getAllTweet = async(page: number = 1, limit: number = 10) =>{
  const response = await axiosInstance.get(`/tweets/get-all-tweets`)
  return response.data;
}

// Toggle like/unlike a tweet
export const toggleLikeTweet = async (tweetId: string) => {
  const response = await axiosInstance.post(`/likes/toggle-tweet-like/${tweetId}`);
  return response.data;
};

// Get user's liked tweets
export const getLikedTweets = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`/likes/get-liked-tweets?page=${page}&limit=${limit}`);
  return response.data;
};

//get likes count of a tweet
export const getTweetLikesCount = async(tweetId: string) =>{
const response = await axiosInstance.get(`/likes/get-tweet-likes-count/${tweetId}`);
return response.data;
}

//all tweets with likes count and isLiked flag
export const getAllTweets = async () => {
  const response = await axiosInstance.get("/likes/all-tweets"); 
  return response.data
};