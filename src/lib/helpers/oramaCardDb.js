import { create } from '@orama/orama';

export async function createCardDb() {
	const cardDb = await create({
		schema: {
			name: 'string',
			image_uris: {
				small: 'string'
			},
			oracle_text: 'string'
		}
	});

	return cardDb;
}
