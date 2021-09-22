import { Request, Response } from "express";
import fetch from "https";
import superfetch from "../../../src/util/superfetch";
import path from "path";
import fs from "fs";

export const route = [
	"v1/vanilla/v:tag/:build/download"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Fetch vanilla versions
	const { versions } = await superfetch<VanillaProject>("https://launchermeta.mojang.com/mc/game/version_manifest.json", 1000*60*15);

	// Get URL query
	const query = req.query?.query?.toString() ?? "";
	const { tag } = req.params;

	// Get download url
	const download = await versions
		.filter(build => build.id === tag)
		.map(async v => {
			const downloads = (await superfetch(v.url, null)).downloads;
			return <ProjectVersion>{ ...v, downloads };
		})
		.map(async v => (await v).downloads.server.url)[0];

	// Set file name
	const name = `server-${tag}.jar`;

	// Get downloaded location
	const save = path.resolve(`./data/${name}`);
	const done = () => res.download(save, name);

	// If cached, download cache
	if (fs.existsSync(save)) return done();

	// Download file
	fetch.get(download, function(response) {
		if (response.statusCode === 200) {
			const file = fs.createWriteStream(save);
			response.pipe(file).on("finish", done);
		}
	});

}
