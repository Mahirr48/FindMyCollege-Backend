export const uploadFile = async (file) => {
  if (!file) return null;

  return `/uploads/${file.filename}`;
};