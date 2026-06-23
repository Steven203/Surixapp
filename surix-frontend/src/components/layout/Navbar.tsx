'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type NavbarProps = {
    leftContent?: React.ReactNode
    centerContent?: React.ReactNode
    rightContent?: React.ReactNode
    className?: string
    logoHref?: string
}

export default function Navbar({
    leftContent,
    centerContent,
    rightContent,
    className,
    logoHref = '/',
}: NavbarProps) {
    const router = useRouter()

    return (
        <header className={cn('bg-white border-b border-slate-200 sticky top-0 z-10', className)}>
            <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <button
                    onClick={() => router.push(logoHref)}
                    className="flex items-center gap-3 flex-shrink-0 min-w-0 text-left"
                >
                    {leftContent}
                </button>

                <div className="w-full md:flex-1 md:max-w-md min-w-0">
                    {centerContent}
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end flex-shrink-0">
                    {rightContent}
                </div>
            </div>
        </header>
    )
}