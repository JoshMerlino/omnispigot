import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import YAML from "yaml";

export const route = [
	"v1/flavor",
	"v1/flavors"
];

export default async function api(req: Request, res: Response): Promise<void> {
	res.json(YAML.parse(await fs.readFile(path.resolve("./flavors.yml"), "utf8")));
}
