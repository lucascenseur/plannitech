"use client";

import { generateAlternateUrls } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

interface AlternateLinksProps {
  baseUrl?: string;
}

export function AlternateLinks({ baseUrl = 'https://plannitech.com' }: AlternateLinksProps) {
  const pathname = usePathname();
  const alternateUrls = generateAlternateUrls(pathname, baseUrl);

  return (
    <>
      {alternateUrls.map(({ locale, url }) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={url}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/fr${pathname.replace(/^\/[a-z]{2}/, '')}`}
      />
    </>
  );
}
