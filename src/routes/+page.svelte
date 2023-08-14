<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { capitalizeEveryWord } from '$lib/helpers/helperFunctions';
	import { createCardDb } from '$lib/helpers/oramaCardDb';
	import { insertMultiple, search } from '@orama/orama';

	let cardName = '';
	let prompt = '';
	let userPrompt = '';
	let loading = false;
	let loadingText = '';
	let cardDb;
	let answer = '';

	let list = [];
	$: console.log(list);

	const getCardsFromDb = async () => {
		const response = await fetch('/api/getCardInfo');
		const data = await response.json();
		console.log(data);
		return data;
	};

	const insertCardsToOramaDb = async (cards) => {
		cardDb = await createCardDb();

		await insertMultiple(cardDb, cards);
	};

	const findCardByName = async () => {
		console.log('searching card');
		const searchResult = await search(cardDb, {
			term: cardName,
			properties: ['name'],
			tolerance: 1
		});

		console.log('searchResults', searchResult);

		const resultWithImage = searchResult.hits.find((result) => {
			const testResult = result.document.hasOwnProperty('image_uris');
			console.log(result);
			// const { document } = result.document.hasOwnProperty('image_uris');
			// prompt = `${prompt} ; ${document.name}: ${document.oracle_text}`;
			return testResult;
		});

		console.log('result with image:', resultWithImage);

		if (resultWithImage) {
			console.log('result with image', resultWithImage.document);
			list = [...list, resultWithImage.document];
			cardName = '';
		}
		console.log(list);
	};

	function extractNumberFromEventCode(eventCode) {
		const numberRegex = /\d+/;
		const match = eventCode.match(numberRegex);
		return match ? match[0] : null;
	}

	function handleKeyPress(e) {
		// console.log(e);
		const number = extractNumberFromEventCode(e.code);
		// console.log(number);
		if (!number) {
			return;
		} else {
			if (number < list.length || number == list.length) {
				list.splice(number - 1, 1);
				list = list;
			}
		}
	}

	async function sendPrompt() {
		loading = true;
		loadingText = 'sending prompt to judge ai';
		try {
			let oracleText = '';

			list.forEach((card) => {
				oracleText += card.name + ': ' + card.oracle_text;
			});

			console.log(oracleText);

			const requestBody = {
				prompt: prompt,
				oracleText: oracleText
			};

			const response = await fetch('/api/sendPrompt', {
				method: 'POST',
				body: JSON.stringify(requestBody),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();
			answer = data.message;
			console.log(test);
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		loading = true;
		loadingText = ' fetching cards from the database';
		const cards = await getCardsFromDb();
		loadingText = 'Preparing cards for quick search';
		console.log(cards.cardNames);
		console.log(cards.cardNames.length);
		await insertCardsToOramaDb(cards.cardNames);
		console.log('cards inserted');
		loading = false;
		loadingText = '';
	});
</script>

<div class="shell">
	<div>
		{#if loading}
			<p>{loadingText}</p>
		{/if}
		<h3>Enter cardnames</h3>
		<form on:submit={findCardByName}>
			<input
				class="input"
				type="text"
				bind:value={cardName}
				placeholder="Enter cards here, submit after every card"
			/>
		</form>
		<form on:submit={sendPrompt}>
			<input class="input" type="text" bind:value={prompt} placeholder="Enter question" />
		</form>
		<h2>{answer}</h2>
	</div>
	<div class="cardHolder">
		{#each list as card, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class=""
				on:click={(index) => {
					console.log('clicked');
					list.splice(index, 1);
					list = list;
				}}
			>
				<p>{index + 1}</p>
				<p>{card.name}</p>
				<!-- <p>{card.oracle_text}</p> -->
				<img src={card.image_uris.small} alt="" />
			</div>
		{/each}
	</div>
</div>

<style>
	p {
		padding: 2px;
		max-width: 150px;
	}

	.shell {
		display: grid;
		grid-template-rows: 150px 1fr;
		align-items: center;
		text-align: center;
	}

	.cardHolder {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		justify-items: center;
	}

	h2 {
		margin: 0 10vw;
	}
</style>
