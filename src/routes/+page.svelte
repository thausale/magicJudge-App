<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { capitalizeEveryWord } from '$lib/helpers/helperFunctions';
	import { cardDb } from '$lib/helpers/oramaCardDb';
	import { insertMultiple, search } from '@orama/orama';

	let cardName = '';
	let prompt = '';
	let loading = false;
	let loadingText = '';

	let list = [];
	$: console.log(list);

	const getCardsFromDb = async () => {
		const response = await fetch('/api/getCardInfo');
		const data = await response.json();
		console.log(data);
		return data;
	};

	const insertCardsToOramaDb = async (cards) => {
		await insertMultiple(cardDb, cards);
	};

	const findCardByName = async () => {
		console.log('searching card');
		const searchResult = await search(cardDb, {
			term: cardName,
			properties: ['name'],
			tolerance: 1
		});
		console.log(searchResult.hits);
		console.log('searchresult: ', searchResult);

		const resultWithImage = searchResult.hits.find((result) => {
			console.log(result.document.hasOwnProperty('image_uris'));

			return result.document.hasOwnProperty('image_uris');
		});

		console.log(resultWithImage);

		if (resultWithImage) {
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
		let oracleText = '';

		list.forEach((card) => {
			oracleText += card.name + ': ' + card.oracle_text;
		});

		console.log(oracleText);

		const response = await fetch('/api/sendPrompt', {
			method: 'POST',
			body: JSON.stringify(prompt),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const test = await response.json();

		console.log(test);
	}

	onMount(async () => {
		loading = true;
		loadingText = ' fetching cards from the database';
		const cards = await getCardsFromDb();
		loadingText = 'Preparing cards for quick search';
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
</style>
