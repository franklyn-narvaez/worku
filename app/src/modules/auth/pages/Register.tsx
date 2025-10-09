"use client";

import { useEffect, useState } from "react";
import type { College } from "@prisma/client";
import { requestColleges } from "../requests/register";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
	const [colleges, setColleges] = useState<College[] | undefined>(undefined);

	useEffect(() => {
		requestColleges()
			.then((res) => res.json())
			.then((data) => setColleges(data));
	}, []);

	if (!colleges) return <div>Cargando...</div>;

	return <RegisterForm colleges={colleges} />;
}

export default RegisterPage;
