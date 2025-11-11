import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { REPORT_PROFILES_BY_SEMESTER, REPORT_STATS, REPORT_TRENDS } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';

const STATUS_LABELS: Record<string, string> = {
	APPROVED: 'Aprobado',
	REJECTED: 'Rechazado',
	SUBMITTED: 'En revisión',
	DRAFT: 'Borrador',
	DEFAULT: 'Desconocido',
};

const COLORS: Record<string, string> = {
	APPROVED: '#22c55e', // verde
	REJECTED: '#ef4444', // rojo
	PENDING: '#3b82f6', // azul
	DEFAULT: '#94a3b8', // gris
};

const ProfilesReportsView = () => {
	const { createAuthFetchOptions } = useAuth();

	const [totalByStatus, setTotalByStatus] = useState<Record<string, number>>({});
	const [trends, setTrends] = useState<any[]>([]);
	const [semesterStats, setSemesterStats] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const options = await createAuthFetchOptions();

			// 1️⃣ Estadísticas totales por estado
			const resStats = await fetch(REPORT_STATS, options);
			const jsonStats = await resStats.json();
			setTotalByStatus(jsonStats.totalByStatus || {});

			// 2️⃣ Tendencias de revisión (Aprobados / Rechazados)
			const resTrends = await fetch(REPORT_TRENDS, options);
			const jsonTrends = await resTrends.json();
			setTrends(jsonTrends.data || []);

			// 4️⃣ Distribución por semestre
			const resSemester = await fetch(REPORT_PROFILES_BY_SEMESTER, options);
			const jsonSemester = await resSemester.json();
			setSemesterStats(jsonSemester.data || []);
		} catch (err) {
			console.error('Error al obtener reportes de perfiles:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) return <p className="text-center py-6">Cargando reportes de perfiles...</p>;

	// ✅ Convertir los datos de totalByStatus a formato de gráfica
	const statusData = Object.entries(totalByStatus).map(([status, count]) => ({
		status,
		total: count,
	}));

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
			{/* 📊 Perfiles por estado */}
			<Card className="shadow-md">
				<CardHeader>
					<CardTitle>Perfiles por estado</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={statusData}
								dataKey="total"
								nameKey="status"
								cx="50%"
								cy="50%"
								outerRadius={100}
								label={(entry: any) => STATUS_LABELS[entry.status] || STATUS_LABELS.DEFAULT}
							>
								{statusData.map(entry => (
									<Cell key={entry.status} fill={COLORS[entry.status] || COLORS.DEFAULT} />
								))}
							</Pie>
							<Tooltip
								formatter={(v: number, _, item: any) =>
									`${v} perfiles (${STATUS_LABELS[item.payload.status] || STATUS_LABELS.DEFAULT})`
								}
							/>
							<Legend formatter={value => STATUS_LABELS[value] || STATUS_LABELS.DEFAULT} />
						</PieChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* 📈 Tendencia de revisiones */}
			<Card className="shadow-md">
				<CardHeader>
					<CardTitle>Tendencia de revisiones</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={trends} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
							<XAxis dataKey="status" tickFormatter={status => STATUS_LABELS[status] || STATUS_LABELS.DEFAULT} />
							<YAxis />
							<Tooltip
								formatter={(v: number, _, item: any) =>
									`${v} perfiles (${STATUS_LABELS[item.payload.status] || STATUS_LABELS.DEFAULT})`
								}
							/>
							<Bar dataKey="total" name="Cantidad de perfiles">
								{trends.map(entry => (
									<Cell key={entry.status} fill={COLORS[entry.status] || COLORS.DEFAULT} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
			{/* 🎓 Distribución por semestre */}
			<Card className="shadow-md lg:col-span-2">
				<CardHeader>
					<CardTitle>Distribución de revisiones por semestre</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={350}>
						<BarChart data={semesterStats} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
							<XAxis
								dataKey="semester"
								tick={{ fontSize: 12 }}
								label={{ value: 'Semestre', position: 'insideBottom', offset: -5 }}
							/>
							<YAxis />
							<Tooltip formatter={(v: number) => `${v} perfiles`} />
							<Legend />
							<Bar dataKey="approved" fill={COLORS.APPROVED} name="Aprobados" />
							<Bar dataKey="rejected" fill={COLORS.REJECTED} name="Rechazados" />
							<Bar dataKey="total" fill="#3b82f6" name="Total" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProfilesReportsView;
