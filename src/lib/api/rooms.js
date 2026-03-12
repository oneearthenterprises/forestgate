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
        body: roomData,
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
    const response = await fetch(API.UpdateRoom(roomId), {
      method: "PUT",
      body: roomData,
    });

    if (!response.ok) {
      throw new Error("Failed to update room");
    }

    return await response.json();
  },

  deleteRoom: async (roomId) => {
    try {
      const response = await fetch(API.DeleteRoom(roomId), {
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
