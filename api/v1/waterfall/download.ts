import { Request, Response } from "express";
import superfetch from "../../../src/util/superfetch";
import fetch from "https";
import path from "path";
import fs from "fs";

declare interface Build {
	version: string;
	build: number;
	time: string;
	changes: {
		commit: string;
		summary: string;
		message: string;
	}[];
	downloads: {
		application: {
			name: string;
			sha256: string;
		}
	}
}
declare interface WaterfallBuilds {
	builds: Build[];
}

export const route = [
	"v1/waterfall/v:tag/:build/download"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Get tag
	const { tag, build } = req.params;
	const [ major, minor, patch ] = tag.split(".");

	// Fetch waterfall builds
	const project = await superfetch<WaterfallBuilds>(`https://papermc.io/api/v2/projects/waterfall/version_group/${major}.${minor}/builds`, 1000*60*15);
	const builds = project.builds
		.filter(build => build.version === tag);

	// Get resource to download
	const resource = build.toLowerCase() === "latest" ? builds[builds.length - 1] : builds.filter(b => b.build.toString() === build)[0];

	// Get download url
	const { name } = resource.downloads.application;
	const download = `https://papermc.io/api/v2/projects/waterfall/versions/${tag}/builds/${resource.build}/downloads/${name}`;

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
