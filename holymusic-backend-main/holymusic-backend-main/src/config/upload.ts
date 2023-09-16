import multer from 'multer';
import path from 'path';

import grid from 'gridfs-stream';
import mongoose from 'mongoose';
import { uploadSong } from '@/controllers';
// import { uploadSong } from "@/controllers/index.controller";
grid.mongo = mongoose.mongo;
const gfs = grid(mongoose.connection.db);

export const songStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/storesongs/songs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const upload = multer({
  storage: songStorage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

export default uploadSong;
