import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  file: String,
  title: String,
  artist: String,
  filePath: String,
});

const Video = mongoose.model('Song', videoSchema);
export default Video;
