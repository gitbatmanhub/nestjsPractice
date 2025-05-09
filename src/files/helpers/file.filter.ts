export const FileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('No file selected'), false);

  const fileExtencion = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png'];

  if (validExtension.includes(fileExtencion)) return callback(null, true);

  callback(null, false);
};
