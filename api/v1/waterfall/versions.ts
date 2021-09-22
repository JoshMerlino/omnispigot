import { Request, Response } from "express";
import inject from "../../../src/util/inject";
import superfetch from "../../../src/util/superfetch";

declare interface WaterfallProject {
	versions: string[]
}

export const route = [
	"v1/waterfall/versions"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Fetch paper project & versions
	const project = await superfetch<WaterfallProject>("https://papermc.io/api/v2/projects/waterfall", 1000*60*15);
	const { versions } = project;

	// Get URL query
	const query = req?.query?.query?.toString() ?? "";

	// Get request origin
	const origin = req.hostname || req.headers.host?.split(":")[0];

	res.json({
		versions: await Promise.all(versions
			.filter(v => v.match(query))
			.map(async v => ({
				version: v,
				builds: await inject(`/api/v1/waterfall/v${v}/builds`, req, "builds")
			}))),
		query
	});
}
