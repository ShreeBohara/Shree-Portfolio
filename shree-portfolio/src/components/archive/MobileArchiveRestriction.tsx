'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { Monitor, ArrowLeft } from 'lucide-react';

export function MobileArchiveRestriction() {
    const router = useRouter();
    const { isMobile } = useUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-6 text-center backdrop-blur-sm">
            <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <Monitor className="h-8 w-8 text-white/80" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Desktop Experience Recommended
                    </h2>
                    <p className="text-zinc-400">
                        To experience the Archive in its full glory, please view this section on a larger screen or desktop device.
                    </p>
                </div>

                <Button
                    onClick={() => router.push('/')}
                    className="group relative overflow-hidden bg-white text-black hover:bg-zinc-200"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Return Home
                </Button>
            </div>
        </div>
    );
}
