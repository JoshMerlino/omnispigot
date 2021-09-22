import { Request } from "express";
import { readFileSync } from "fs";
import fetch from "node-fetch";
import { resolve } from "path";

const { webserver } = JSON.parse(readFileSync(resolve("./package.json"), "utf8"));

export default function inject(url: string, req: Request, target: string | null = null): Promise<string | Record<string, unknown>> {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	return new Promise(resolve => {
		if (!req.query.hasOwnProperty("deep") && req.header("deep") !== "true") return resolve(url);
		fetch(`http://localhost:${process.env.PORT || webserver.http.port}${url}`)
			.then(response => response.json())
			.then(resp => resolve(target === null ? resp : resp[target]));
	});
}
