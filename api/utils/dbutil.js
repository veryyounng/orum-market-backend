import logger from './logger.js';
import { db as DBConfig } from '../config/index.js';
import { MongoClient } from 'mongodb';

var db;

var url;
if (process.env.NODE_ENV === 'production') {
  url = process.env.CLOUD_DB;
} else {
  url =
    'mongodb+srv://lion:lion@cluster0.vzsl9if.mongodb.net/?retryWrites=true&w=majority';
}

const client = new MongoClient(url);

try {
  logger.log(`DB 접속: ${url}`);
  await client.connect();
  logger.info(`DB 접속 성공: ${url}`);
  db = client.db(DBConfig.database);
  db.user = db.collection('user');
  db.product = db.collection('product');
  db.cart = db.collection('cart');
  db.order = db.collection('order');
  db.reply = db.collection('reply');
  db.seq = db.collection('seq');
  db.code = db.collection('code');
} catch (err) {
  logger.error(err);
}

export const getDB = () => db;

export const getClient = () => client;

export const nextSeq = async (_id) => {
  let result = await db.seq.findOneAndUpdate({ _id }, { $inc: { no: 1 } });
  logger.debug(_id, result.no);
  return result.no;
};

export default db;
