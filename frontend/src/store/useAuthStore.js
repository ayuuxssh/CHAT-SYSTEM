
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Backend URL
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_UPL;

export const useAuthStore = create((set, get) => ({
  // State
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],

  // Check Authentication
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.error("Error in authCheck:", error);

      set({ authUser: null });

      get().disconnectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });

      toast.success("Account Created Successfully");

      get().connectSocket();
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data });

      toast.success("Logged in Successfully");

      get().connectSocket();
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      // Disconnect socket first
      get().disconnectSocket();

      // Clear authentication state
      set({
        authUser: null,
        onlineUsers: [],
      });

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error.response?.data?.message || "Error logging out"
      );
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put(
        "/auth/update-profile",
        data
      );

      set({ authUser: res.data });

      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("Error in update profile:", error);

      toast.error(
        error.response?.data?.message || "Profile update failed"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect Socket
  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    // Avoid creating duplicate sockets
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    // Listen for online users
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  // Disconnect Socket
  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();

      set({
        socket: null,
        onlineUsers: [],
      });
    }
  },
}));
