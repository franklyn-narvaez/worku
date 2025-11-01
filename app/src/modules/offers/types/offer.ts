import type { Offer } from '@prisma/client';

export type ExtendedOffer = Offer & {
	college: {
		id: string;
		name: string;
	} | null;
	faculty: {
		id: string;
		name: string;
	} | null;
};
