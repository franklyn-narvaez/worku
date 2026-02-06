import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
	REPORT_DEPENDENCE_FACULTY,
	REPORT_DEPENDENCE_RESULTS,
	REPORT_DEPENDENCE_SKILLS,
	REPORT_DEPENDENCE_STATS,
} from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';

// Colores por estado
const COLORS: Record<string, string> = {
	APPROVED: '#22c55e', // verde
	REJECTED: '#ef4444', // rojo
	DEFAULT: '#3b82f6', // azul
};

const OffersReportsView = () => {
	const { createAuthFetchOptions } = useAuth();

	const [applicants, setApplicants] = useState<any[]>([]);
	const [results, setResults] = useState<any[]>([]);
	const [facultyDist, setFacultyDist] = useState<any[]>([]);
	const [skills, setSkills] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const options = await createAuthFetchOptions();

			// 1️⃣ Aplicantes por oferta
			const resApplicants = await fetch(REPORT_DEPENDENCE_STATS, options);
			const jsonApplicants = await resApplicants.json();
			setApplicants(jsonApplicants.data || []);

			// 2️⃣ Resultados (Aprobados / Rechazados)
			const resResults = await fetch(REPORT_DEPENDENCE_RESULTS, options);
			const jsonResults = await resResults.json();
			setResults(jsonResults.data || []);

			// 3️⃣ Distribución por facultad
			const resFaculty = await fetch(REPORT_DEPENDENCE_FACULTY, options);
			const jsonFaculty = await resFaculty.json();
			setFacultyDist(jsonFaculty.data || []);

			// 4️⃣ Top habilidades
			const resSkills = await fetch(REPORT_DEPENDENCE_SKILLS, options);
			const jsonSkills = await resSkills.json();
			setSkills(jsonSkills.data || []);
		} catch (err) {
			console.error('Error al obtener reportes:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) return <LoadingSpinner text="Cargando estadísticas..." />;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
			{/* 📊 Aplicantes por oferta */}
			<Card className="shadow-md">
				<CardHeader>
					<CardTitle>Aplicantes por oferta</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							data={applicants}
							margin={{ top: 20, right: 20, left: 20, bottom: 50 }} // 👈 espacio inferior
						>
							<XAxis
								dataKey="offerTitle"
								tick={{ fontSize: 10, fill: '#374151' }}
								angle={-25}
								textAnchor="end"
								interval={0} // 👈 muestra todos los labels
								height={60} // 👈 asegura espacio para el texto
							/>
							<YAxis />
							<Tooltip formatter={(v: number) => `${v} aplicantes`} />
							<Bar dataKey="totalApplicants" fill={COLORS.DEFAULT} name="Aplicantes" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* 🟢 Resultados (Aprobados vs Rechazados) */}
			<Card className="shadow-md">
				<CardHeader>
					<CardTitle>Resultados de aplicaciones</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={results} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
							<XAxis
								dataKey="offerTitle"
								tick={{ fontSize: 10, fill: '#374151' }}
								angle={-25}
								textAnchor="end"
								interval={0}
								height={60}
								tickFormatter={value => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
							/>
							{/* ✅ Eje Y con valores enteros */}
							<YAxis tickFormatter={value => String(Math.round(value))} />

							{/* ✅ Tooltip con valores enteros */}
							<Tooltip formatter={(v: number) => `${Math.round(v)} estudiantes`} />

							{/* ✅ Leyenda personalizada */}
							<Legend
								content={() => (
									<div style={{ display: 'flex', gap: 12 }}>
										<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
											<span
												style={{
													width: 12,
													height: 12,
													background: COLORS.APPROVED,
													display: 'inline-block',
													borderRadius: 2,
												}}
											/>
											<span>Aprobados</span>
										</div>
										<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
											<span
												style={{
													width: 12,
													height: 12,
													background: COLORS.REJECTED,
													display: 'inline-block',
													borderRadius: 2,
												}}
											/>
											<span>Rechazados</span>
										</div>
									</div>
								)}
							/>

							<Bar dataKey="total" name="Total" label={{ position: 'top' }}>
								{results.map(entry => {
									const stableKey =
										(entry && (entry.offerId ?? entry.offerTitle ?? entry.id)) ??
										entry?.status ??
										Math.random().toString(36).slice(2);

									return (
										<Cell
											key={String(stableKey) + '-' + String(entry?.status)}
											fill={COLORS[entry.status] || COLORS.DEFAULT}
										/>
									);
								})}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* 🏫 Distribución por facultad */}
			<Card className="shadow-md">
				<CardHeader>
					<CardTitle>Distribución por facultad</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={facultyDist}
								dataKey="total"
								nameKey="faculty"
								cx="50%"
								cy="50%"
								outerRadius={100}
								label={(entry: any) => entry.faculty}
							>
								{facultyDist.map((entry, i) => (
									<Cell key={`cell-fac-${entry.faculty}`} fill={COLORS[Object.keys(COLORS)[i % 3]] || '#94a3b8'} />
								))}
							</Pie>
							<Tooltip formatter={(v: number) => `${v} aplicantes`} />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* 💻 Top 10 habilidades más comunes */}
			<Card className="shadow-md">
				<CardHeader>
					<CardTitle>Top 10 habilidades más comunes</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={skills} layout="vertical" margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
							<XAxis type="number" />
							<YAxis dataKey="skill" type="category" width={120} />
							<Tooltip formatter={(v: number) => `${v} estudiantes`} />
							<Bar dataKey="total" fill="#06b6d4" name="Cantidad" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default OffersReportsView;
