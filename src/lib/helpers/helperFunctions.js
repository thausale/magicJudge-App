/**
 *
 * @param {string} sentence
 * @returns
 */
export function capitalizeEveryWord(sentence) {
	if (typeof sentence !== 'string' || sentence.length === 0) {
		return sentence;
	}

	return sentence
		.split(' ')
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
}
