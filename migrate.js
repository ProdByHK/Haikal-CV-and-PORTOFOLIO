const fs = require('fs');

const indexHtml = fs.readFileSync('temp_backup/index.html', 'utf8');

const styleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

const scriptMatch = indexHtml.match(/<script>([\s\S]*?)<\/script>/);
const js = scriptMatch ? scriptMatch[1] : '';

const bodyMatch = indexHtml.match(/<body>([\s\S]*?)<script>/);
const bodyHtml = bodyMatch ? bodyMatch[1] : '';

if (!fs.existsSync('app')) {
  fs.mkdirSync('app');
}

const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

${css}`;
fs.writeFileSync('app/globals.css', globalsCss);

const layoutTsx = `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'haikal pasha — Creative Designer',
  description: 'haikal pasha — Creative Designer, Brand Strategist, and Visual Storyteller. Portfolio and CV.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}`;
fs.writeFileSync('app/layout.tsx', layoutTsx);

// We need to convert bodyHtml to JSX compatible or use dangerouslySetInnerHTML
// Because of the class vs className, and inline styles
const pageTsx = `"use client";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Run the extracted script
    const script = document.createElement('script');
    script.src = '/script.js';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: \`${bodyHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}
`;
fs.writeFileSync('app/page.tsx', pageTsx);

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
fs.writeFileSync('public/script.js', js);

console.log('Migration completed for index.html!');
