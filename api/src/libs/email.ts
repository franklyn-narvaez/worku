import nodemailer, { type Transporter } from 'nodemailer';

// Create email transporter
const createTransporter = async (): Promise<Transporter | null> => {
	const smtpHost = process.env.SMTP_HOST;
	const smtpPort = process.env.SMTP_PORT;
	const smtpUser = process.env.SMTP_USER;
	const smtpPass = process.env.SMTP_PASS;

	// If using Ethereal (test account), create it automatically
	if (process.env.USE_ETHEREAL === 'true' || (!smtpHost && process.env.NODE_ENV !== 'production')) {
		console.log('📧 Using Ethereal test email account...');
		const testAccount = await nodemailer.createTestAccount();

		return nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		});
	}

	// Otherwise use configured SMTP
	if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
		console.warn(
			'⚠️  Email configuration incomplete. Configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env, or set USE_ETHEREAL=true',
		);
		return null;
	}

	return nodemailer.createTransport({
		host: smtpHost,
		port: parseInt(smtpPort),
		secure: parseInt(smtpPort) === 465,
		auth: {
			user: smtpUser,
			pass: smtpPass,
		},
	});
};

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
	try {
		const transporter = await createTransporter();

		if (!transporter) {
			console.log('Email service not configured. Skipping email send.');
			return false;
		}

		const emailFrom = process.env.EMAIL_FROM || 'noreply@example.com';

		const info = await transporter.sendMail({
			from: emailFrom,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
		});

		console.log('✅ Email sent successfully:', info.messageId);

		// Si es Ethereal, mostrar el URL para ver el email
		if (process.env.USE_ETHEREAL === 'true' || process.env.SMTP_HOST === undefined) {
			const previewUrl = nodemailer.getTestMessageUrl(info);
			console.log('📧 Preview URL:', previewUrl || 'Check your test account');
		}

		return true;
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
}

export function generatePasswordResetEmailHTML(resetLink: string, userName: string): string {
	return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9fafb;
                border-radius: 8px;
                padding: 40px;
                border: 1px solid #e5e7eb;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #dc2626;
                margin-bottom: 10px;
            }
            .content {
                background-color: white;
                border-radius: 6px;
                padding: 30px;
                margin-bottom: 20px;
            }
            .title {
                font-size: 20px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 15px;
            }
            .message {
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 20px;
                color: #4b5563;
            }
            .reset-button {
                display: inline-block;
                background-color: #dc2626;
                color: white;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin: 20px 0;
            }
            .reset-button:hover {
                background-color: #b91c1c;
            }
            .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 13px;
                color: #78350f;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                margin-top: 30px;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
            .link-text {
                word-break: break-all;
                color: #dc2626;
                text-decoration: none;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Worku</div>
                <p style="color: #6b7280; margin: 0;">Recuperación de Contraseña</p>
            </div>
            
            <div class="content">
                <div class="title">Hola ${userName},</div>
                
                <div class="message">
                    Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo para crear una nueva contraseña.
                </div>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="reset-button">Restablecer Contraseña</a>
                </div>
                
                <div class="message">
                    O copia y pega este enlace en tu navegador:<br>
                    <span class="link-text">${resetLink}</span>
                </div>
                
                <div class="warning">
                    ⚠️ Este enlace expirará en 1 hora por razones de seguridad.
                </div>
                
                <div class="message">
                    Si no solicitaste restablecer tu contraseña, puedes ignorar este email. Tu contraseña no cambiará.
                </div>
            </div>
            
            <div class="footer">
                <p>Este es un email automático, por favor no respondas a este mensaje.</p>
                <p>© 2026 Worku. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
