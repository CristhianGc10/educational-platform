import './globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Plataforma Educativa Inmersiva',
    description:
        'Plataforma educativa revolucionaria donde los estudiantes construyen activamente su conocimiento matemático a través de experiencias interactivas, simulaciones 3D y aplicaciones del mundo real.',
    keywords: ['educación', 'matemáticas', 'interactivo', '3D', 'aprendizaje'],
    authors: [{ name: 'Educational Platform Team' }],
    openGraph: {
        title: 'Plataforma Educativa Inmersiva',
        description:
            'Aprende matemáticas de forma interactiva con simulaciones 3D',
        type: 'website',
        locale: 'es_ES',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="h-full">
            <body
                className={`${inter.className} h-full bg-gradient-to-br from-slate-50 to-blue-50 antialiased`}
            >
                <div className="min-h-full">{children}</div>
            </body>
        </html>
    );
}
