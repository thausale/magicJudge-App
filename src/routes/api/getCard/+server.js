import connectDb from '$lib/helpers/db';
import { CardModel as Card } from '$lib/models/card.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	connectDb();
	const cardName = await request.json();
	console.log(cardName);

	const data = await Card.findOne({ name: cardName });
	if (!data) {
		return json({
			status: 404,
			body: { message: 'Card not found' }
		});
	}

	return json({
		status: 200,
		body: data
	});
}
