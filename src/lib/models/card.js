import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	object: {
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true
	},
	oracle_id: {
		type: String,
		required: true
	},
	multiverse_ids: {
		type: [Number],
		default: undefined
	},
	mtgo_id: Number,
	mtgo_foil_id: Number,
	tcgplayer_id: Number,
	cardmarket_id: Number,
	name: {
		type: String,
		required: true
	},
	lang: {
		type: String,
		required: true
	},
	released_at: {
		type: Date,
		required: true
	},
	uri: {
		type: String,
		required: true
	},
	scryfall_uri: {
		type: String,
		required: true
	},
	layout: {
		type: String,
		required: true
	},
	highres_image: {
		type: Boolean,
		required: true
	},
	image_status: {
		type: String,
		required: true
	},
	image_uris: {
		type: mongoose.Schema.Types.Mixed
	},
	mana_cost: {
		type: String,
		required: true
	},
	cmc: {
		type: Number,
		required: true
	},
	type_line: {
		type: String,
		required: true
	},
	oracle_text: {
		type: String,
		required: true
	},
	colors: {
		type: [String],
		default: undefined
	},
	color_identity: {
		type: [String],
		default: undefined
	},
	keywords: {
		type: [String],
		default: undefined
	}
});

export const CardModel = mongoose.models.Card ?? mongoose.model('Card', CardSchema);
