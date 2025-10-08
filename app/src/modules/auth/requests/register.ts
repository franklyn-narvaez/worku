import type { RegisterType } from "../schemas/register";

export async function registerRequets(data: RegisterType) {
	return await fetch("http://localhost:3000/api/user/register", {
		method: "POST",
		body: JSON.stringify({
			name: data.name,
			lastName: data.lastName,
			email: data.email,
			collegeId: data.collegeId,
			password: data.password,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export async function requestColleges() {
	return await fetch("http://localhost:3000/api/college", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
}
