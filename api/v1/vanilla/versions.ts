import { Request, Response } from "express";
import inject from "../../../src/util/inject";
import superfetch from "../../../src/util/superfetch";

export const route = [
	"v1/vanilla/versions"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Fetch vanilla versions
	const { versions } = await superfetch<PaperProject>("https://launchermeta.mojang.com/mc/game/version_manifest.json", 1000*60*15);

	// Get URL query
	const query = req.query?.query?.toString() ?? "";

	res.json({
		versions: await Promise.all(versions
			.filter(v => v.id.match(query))
			.filter(v => v.id.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/g))
			.map(async v => ({
				version: v.id,
				builds: await inject(`/api/v1/vanilla/v${v.id}/builds`, req, "builds")
			}))),
		query
	});
}
