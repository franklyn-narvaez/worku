import React from 'react';

interface LoadingSpinnerProps {
	text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Cargando...' }) => {
	return (
		<div style={styles.container}>
			<div style={styles.spinner}></div>
			<p style={styles.text}>{text}</p>
		</div>
	);
};

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		height: '60vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '12px',
	},
	spinner: {
		width: '48px',
		height: '48px',
		border: '5px solid #e5e7eb',
		borderTop: '5px solid #3b82f6',
		borderRadius: '50%',
		animation: 'spin 1s linear infinite',
	},
	text: {
		color: '#6b7280',
		fontSize: '14px',
	},
};

export default LoadingSpinner;
