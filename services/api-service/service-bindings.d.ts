interface Env extends Cloudflare.Env {
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	// Public base URL for R2-stored pet images (CDN / r2.dev). Used to turn
	// stored storageKeys into absolute photo URLs in the catalog routes.
	PUBLIC_ASSET_BASE_URL: string;
}
