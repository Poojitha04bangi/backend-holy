import { MongoClient } from 'mongodb';
import { GridFSBucket } from 'mongodb';
import { logger } from '@/utils/logger';
import { DB_NAME, MONGODB_URI } from '@config';
import mongoose from 'mongoose';

const client = new MongoClient(MONGODB_URI);

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info(`Connected To Database`);
  } catch (error) {
    logger.error(error);
  }
};

const database = client.db(DB_NAME);
const buckets = {
  audio: new GridFSBucket(database, { bucketName: 'audio' }),
  video: new GridFSBucket(database, { bucketName: 'video' }),
};
export { connect, database, buckets };
