const imageFileExtensions = ["jpg", "jpeg", "png", "gif", "heic"];

export const isImageFile = (file: Express.Multer.File) => {
  return imageFileExtensions.some(extension => file.originalname.endsWith(extension));
};
