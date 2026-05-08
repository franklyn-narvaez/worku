import { prisma } from '../libs/db';

type StopFn = () => void;

/**
 * Start a periodic job that deletes expired PasswordReset records.
 * Returns a function to stop the interval.
 */
export function startCleanupPasswordResets(options?: { intervalMs?: number }): StopFn {
	const intervalMs = options?.intervalMs ?? 1000 * 60 * 60; // default: 1 hour

	async function run() {
		try {
			const now = new Date();
			const result = await prisma.passwordReset.deleteMany({
				where: { expiresAt: { lt: now } },
			});
			if (result.count && result.count > 0) {
				console.log(`Cleanup: deleted ${result.count} expired password reset(s)`);
			}
		} catch (err) {
			console.error('Error running password reset cleanup job', err);
		}
	}

	// run once immediately
	void run();

	const handle = setInterval(() => void run(), intervalMs);

	return () => clearInterval(handle);
}
