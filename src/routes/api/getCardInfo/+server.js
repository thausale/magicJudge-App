import { json } from '@sveltejs/kit';
import connectDb from '$lib/helpers/db';
import { CardModel } from '$lib/models/card';

export async function GET() {
	connectDb();

	const cardNames = await CardModel.find().select('name image_uris.small oracle_text').exec();

	return json({
		cardNames
	});
}
