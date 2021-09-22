import { Request, Response } from "express";
import superfetch from "../../../src/util/superfetch";

declare interface WaterfallBuilds {
	builds: {
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
	}[];
}

export const route = [
	"v1/waterfall/v:tag/builds"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Get tag
	const { tag } = req.params;
	const [ major, minor, patch ] = tag.split(/\.|-/g);

	// Fetch waterfall builds
	const project = await superfetch<WaterfallBuilds>(`https://papermc.io/api/v2/projects/waterfall/version_group/${major}.${minor}/builds`, 1000*60*15);

	res.json({
		builds: project.builds
			.filter(build => build.version === tag)
			.map(build => ({
				version: build.version,
				build: build.build.toString(),
				time: new Date(build.time).getTime(),
				sha256: build.downloads.application.sha256,
				download: `/api/v1/waterfall/v${build.version}/${build.build}/download`
			}))
	});
}
