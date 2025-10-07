import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
});
