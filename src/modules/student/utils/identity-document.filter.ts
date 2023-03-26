export const identityDocumentFileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    return cb(null, true);
  }
  req.fileValidationError = 'Unsupported file format.';
  return cb(null, false);
};

export const identityDocumentFileLimit = {
  files: 1,
  fileSize: 10 * 1024 * 1024, //5mb in bytes
};
