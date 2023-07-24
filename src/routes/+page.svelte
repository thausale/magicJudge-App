<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { capitalizeEveryWord } from '$lib/helpers/helperFunctions';

	let cardName = '';

	let list = [];
	$: console.log(list);

	const findCardByName = async () => {
		console.log('searching card');
		const response = await fetch('/api/getCard', {
			method: 'POST',
			body: JSON.stringify(capitalizeEveryWord(cardName)),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		cardName = '';
		const { body } = await response.json();
		list = [...list, body];
	};

	function extractNumberFromEventCode(eventCode) {
		const numberRegex = /\d+/;
		const match = eventCode.match(numberRegex);
		return match ? match[0] : null;
	}

	function handleKeyPress(e) {
		// console.log(e);
		const number = extractNumberFromEventCode(e.code);
		console.log(number);
		if (!number) {
			return;
		} else {
			if (number < list.length || number == list.length) {
				list.splice(number - 1, 1);
				list = list;
			}
		}
	}

	onMount(() => {
		window.addEventListener('keypress', handleKeyPress);
	});
</script>

<div class="shell">
	<div>
		<h3>Enter cardnames</h3>
		<form on:submit={findCardByName}>
			<input class="input" type="text" bind:value={cardName} />
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
