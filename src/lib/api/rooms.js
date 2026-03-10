import { API } from "./api";

export const roomApi = {
  getAllRooms: async () => {
    try {
      const response = await fetch(API.GetAllRooms);

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },

  getRoomById: async (roomId) => {
    try {
      const response = await fetch(API.getRoomById(roomId));

      if (!response.ok) {
        throw new Error("Failed to fetch room");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching room:", error);
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await fetch(API.CreateRoom, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  updateRoom: async (roomId, roomData) => {
    try {
      const response = await fetch(API.UpdateRoom(roomId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error("Failed to update room");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  deleteRoom: async (roomId) => {
    try {
      const response = await fetch(API.DeleteRoom, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete room");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },

  uploadRoomImage: async (roomId, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("roomId", roomId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Rooms/api/upload-image`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  uploadRoomVideo: async (roomId, file) => {
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("roomId", roomId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Rooms/api/upload-video`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  },

  deleteRoomImage: async (roomId, imageId) => {
    try {
      const response = await fetch(API.DeleteRoomImage(roomId, imageId), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },

  deleteRoomVideo: async (roomId, videoId) => {
    try {
      const response = await fetch(API.DeleteRoomVideo(roomId, videoId), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete video");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },
};
