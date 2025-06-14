// ===== apps/main-platform/src/app/providers.tsx =====
'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
    children: ReactNode;
    session?: any;
}

export function Providers({ children, session }: ProvidersProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
