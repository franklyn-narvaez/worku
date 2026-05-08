import { startServer } from './server';
import 'dotenv/config';
import { startCleanupPasswordResets } from './jobs/cleanupPasswordResets';

const stopCleanup = startCleanupPasswordResets({ intervalMs: 1000 * 60 * 60 }); // hourly

startServer();

// Optional: on graceful shutdown stop the cleanup interval
process.on('SIGINT', () => {
	stopCleanup();
	process.exit(0);
});

process.on('SIGTERM', () => {
	stopCleanup();
	process.exit(0);
});
