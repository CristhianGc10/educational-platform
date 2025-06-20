// apps/course-arithmetic/src/app/layout.tsx - Verificar que exista un layout básico

import './globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Aritmética Aplicada',
    description: 'Curso interactivo de aritmética con experiencias inmersivas',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <main className="min-h-screen bg-gray-50">{children}</main>
            </body>
        </html>
    );
}
