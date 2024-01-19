import mongoose from 'mongoose';
import ENV from '../config.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function connect() {
    // Create memory server
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();

    // connect to database
    mongoose.set('strictQuery', true);
    // const db = await mongoose.connect(ENV.DB);
    const db = await mongoose.connect(getUri);
    console.log('Connected to database');
    return db;
}

