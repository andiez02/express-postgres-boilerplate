import path from 'path';
import multer from 'multer';
import env from '../../config/env';
import BadRequestError from '../common/errors/types/BadRequestError';
import fileHelper from '../common/helpers/file';
import messages from '../common/messages';

const storage = (storageFolder: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      fileHelper.createFolderIfNotExists(storageFolder);
      cb(null, `${process.cwd()}/${storageFolder}`);
    },
    filename: (req, file, cb) => {
      const fileName = `${new Date().getTime()}${path.extname(file.originalname)}`;
      req.body.fileName = fileName;
      cb(null, fileName);
    },
  });

const multerUpload = (config: { limitSize: number; extensions: string[] }) =>
  multer({
    storage: storage(env.assetsPath),
    fileFilter: (_req, file, callback) => {
      if (!config.extensions.includes(path.extname(file.originalname).toLocaleLowerCase())) {
        return callback(new BadRequestError(messages.upload.extensionNotAllowed));
      }
      callback(null, true);
    },
    limits: { fileSize: config.limitSize },
  });

export default {
  storage,
  multerUpload,
};
