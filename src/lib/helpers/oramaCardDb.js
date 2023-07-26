import { create } from '@orama/orama';

export const cardDb = await create({
	schema: {
		name: 'string',
		image_uris: {
			small: 'string'
		},
		oracle_text: 'string'
	}
});
