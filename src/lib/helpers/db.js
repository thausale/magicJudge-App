import mongoose from 'mongoose';
import { MONGODB_LOGIN } from '$env/static/private';

const connectDb = async () => {
	try {
		const uri = `mongodb+srv://${MONGODB_LOGIN}@cluster0.qmxh36d.mongodb.net/magicJudge`;
		await mongoose.connect(uri);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error(error);
		//res.status(500).json({ status: 'failed', message: error.message });
	}
};

export default connectDb;
