import fetch from "node-fetch";
import path from "path";
import { v3 as hash } from "uuid";
import JSONStore from "filestore-json";
import chalk from "chalk";

export default async function superfetch<T = Record<string, never>>(url: string, lifetime = 60*1000): Promise<T> {

	// Get store name
	const name = hash(url, "8378357e-1b10-11ec-9f14-239c613b5559");
	const data = path.resolve(`./data/${name}.json`);

	// Get JSON store
	const store = JSONStore.from<T>(data);

	// If store is expires
	if (store.age > lifetime || JSON.stringify(store.value) === "{}") {

		// Log request
		console.log(chalk.magenta("[FETCH]"), "fetched request", chalk.cyan(url));

		// Make request
		const resp = await fetch(url)
			.then(response => response.json());

		// Set store value
		store.value = resp;

	}

	// Return store
	return <T>store.value;

}
