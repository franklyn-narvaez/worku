import type { Offer } from '@prisma/client';

export type ExtendedOffer = Offer & {
	college: {
		id: string;
		name: string;
	} | null;
	count: {
		Application: number;
	};
};
