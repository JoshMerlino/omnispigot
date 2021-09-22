import express, { Express } from "express";
import extract from "extract-zip";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import fetch from "node-fetch";
import { resolve } from "path";

export default function runtime(app: Express): void {

	// Get insomnia path
	const readme = resolve("README.md");

	// Before binding to app make sure insomnia.json exists
	if (!existsSync(readme)) return;

	// Serve static
	app.use("/README.md", (_req, res) => res.sendFile(readme));

}
