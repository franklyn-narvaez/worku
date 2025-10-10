import type { User } from '@prisma/client';

export type ExtendedUser = User & {
	college: {
		id: string;
		name: string;
	} | null;
};
