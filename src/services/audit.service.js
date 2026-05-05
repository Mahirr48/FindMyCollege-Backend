export const logAction = async (action, targetId = null) => {
  console.log("AUDIT LOG:", action, targetId);

  // later save to database
};