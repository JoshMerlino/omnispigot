import { Request, Response } from "express";
import superfetch from "../../../src/util/superfetch";

export const route = [
	"v1/paper/v:tag/builds"
];

export default async function api(req: Request, res: Response): Promise<void> {

	// Get tag
	const { tag } = req.params;
	const [ major, minor ] = tag.split(/\.|-/g);

	// Fetch paper builds
	const project = await superfetch<PaperBuilds>(`https://papermc.io/api/v2/projects/paper/version_group/${major}.${minor}/builds`, 1000*60*15);

	res.json({
		builds: project.builds
			.filter(build => build.version === tag)
			.map(build => ({
				version: build.version,
				build: build.build.toString(),
				time: new Date(build.time).getTime(),
				hash: `sha256-${build.downloads.application.sha256}`,
				download: `/api/v1/paper/v${build.version}/${build.build}/download`
			}))
	});
}
