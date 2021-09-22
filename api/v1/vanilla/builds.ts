import { Request, Response } from "express";
import superfetch from "../../../src/util/superfetch";

export const route = [
	"v1/vanilla/v:tag/builds"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Fetch vanilla versions
	const { versions } = await superfetch<VanillaProject>("https://launchermeta.mojang.com/mc/game/version_manifest.json", 1000*60*15);

	// Get URL query
	const query = req.query?.query?.toString() ?? "";
	const { tag } = req.params;

	res.json({
		versions: await Promise.all(versions
			.filter(build => build.id === tag)
			.map(async v => {
				const downloads = (await superfetch(v.url, null)).downloads;
				return <ProjectVersion>{ ...v, downloads };
			})
			.map(async _v => {
				const v = await _v;
				return {
					version: v.id,
					build: "0",
					time: new Date(v.time).getTime(),
					hash: `sha1-${v.downloads.server.sha1}`,
					download: `/api/v1/vanilla/v${tag}/0/download`
				};
			})),
		query
	});
}
