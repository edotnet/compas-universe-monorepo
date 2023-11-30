export const LOCAL_STRATEGY_NAME = 'LOCAL';

export const UPLOAD_FILE_LIMITS = {
  limits: { fileSize: 10 * 1024 * 1024 },

  fileFilter: (req: Request, file, cb) => {
    const ext = file.mimetype;
    if (ext.startsWith('image')) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      
      cb(null, true);
    } else if (ext.startsWith('video')) {
      if (!file.originalname.match(/\.(mp4|mov|avi|gif)$/)) {
        return cb(new Error('Only video files are allowed!'), false);
      }

      cb(null, true);
    }

    cb(null, true);
  },
};
