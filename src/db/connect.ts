import { connect } from 'mongoose';

const dbName = 'Jobs';

function connectDB(uri: string) {
    return connect(uri, { dbName });
}

export default connectDB;
