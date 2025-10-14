'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLocale = locales.find(l => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border-futuristic inline-flex items-center gap-2 rounded-2xl border border-border/30 bg-background/80 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="text-lg">{currentLocale?.flag}</span>
          <span className="hidden sm:inline">{currentLocale?.code.toUpperCase()}</span>
          <Badge variant="futuristic" size="sm" className="ml-1">
            {currentLocale?.name}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map(loc => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className="flex cursor-pointer items-center gap-3 p-3"
          >
            <span className="text-xl">{loc.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{loc.name}</span>
              <span className="text-xs text-muted-foreground">{loc.code.toUpperCase()}</span>
            </div>
            {loc.code === locale && (
              <Badge variant="futuristic" size="sm" className="ml-auto">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
