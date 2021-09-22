declare type APIResponse = Record<string, unknown>;

declare interface Endpoint {
	route: string | string[];
	default(req: Request, res: Response): unknown;
}

declare interface Middleware {
	default(req: Request, res: Response, next: NextFunction): void | Promise<void>;
}

declare interface Runtime {
	default(app: Express): void | Promise<void>;
}

declare interface PaperBuilds {
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

declare interface ProjectVersion {
	id: string;
	url: string;
	time: string;
	downloads: {
		server: {
			sha1: string;
			url: string;
		}
	}
}

declare interface VanillaProject {
	versions: ProjectVersion[]
}

declare interface PaperProject {
	versions: {
		id: string;
		url: string;
	}[]
}
