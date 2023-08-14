import { json } from '@sveltejs/kit';
import { OPENAPI_BEARER } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai';

const configurations = new Configuration({
	apiKey: OPENAPI_BEARER
});
const openai = new OpenAIApi(configurations);

export async function POST({ request, fetch }) {
	const data = await request.json();
	console.log('data', data);

	const url = 'https://api.openai.com/v1/chat/completions';
	const bearer = OPENAPI_BEARER;

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${bearer}`
	};

	const requestData = {
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'system', content: 'You are a judge for the cardgame named magic the gathering' },
			{ role: 'user', content: data.prompt }
		],
		temperature: 0.9
	};

	// Perform the POST request using fetch
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(requestData)
		});

		if (!response) {
			throw new Error(`HTTP error! Status: ${response}`);
		}
		const completion = await response.json(); // Assuming the response contains the completion data
		// console.log(completion);

		console.log(completion.choices[0].message.content);
		return json({ message: completion.choices[0].message.content });
	} catch (error) {
		// @ts-ignore
		console.error('Error:', error.message);
	}

	// console.log(completion.data);
}
