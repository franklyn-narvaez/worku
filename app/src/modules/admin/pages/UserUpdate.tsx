import type { College, Role, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UpdateForm from '../components/UpdateForm';
import { GET_COLLEGE, GET_ROLE } from '@/constants/path';

type UserWithCollege = User & {
	college: {
		id: string;
		name: string;
	} | null;
};

export default function UserUpdate() {
	const { id } = useParams();

	const [user, setUser] = useState<UserWithCollege>();
	const [college, setColleges] = useState<College[]>([]);
	const [role, setRoles] = useState<Role[]>([]);

	useEffect(() => {
		fetch(GET_COLLEGE)
			.then(res => res.json())
			.then(data => setColleges(data));
	}, []);

	useEffect(() => {
		fetch(GET_ROLE)
			.then(res => res.json())
			.then(data => setRoles(data));
	}, []);
	useEffect(() => {
		fetch(`http://localhost:3000/api/user/${id}`)
			.then(res => res.json())
			.then(data => setUser(data));
	}, [id]);

	return <div className="p-6 gap-4">{user && <UpdateForm user={user} college={college} role={role} />}</div>;
}
