import Notification from "../models/Admin/models/Notification.js";

export const sendNotification = async ({ userId, message }) => {
  try {
    const notification = await Notification.create({
      userId,
      message,
      read: false,
    });

    console.log("NOTIFICATION SAVED:", notification._id);

    return notification;
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};