import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  file: String,
  title: String,
  artist: String,
  filePath: String,
});

const Song = mongoose.model('Song', songSchema);
export default Song;
