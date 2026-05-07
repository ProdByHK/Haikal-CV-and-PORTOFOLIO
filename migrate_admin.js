const fs = require('fs');

const adminHtml = fs.readFileSync('temp_backup/admin.html', 'utf8');

const styleMatch = adminHtml.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

const scriptMatch = adminHtml.match(/<script>([\s\S]*?)<\/script>/);
const js = scriptMatch ? scriptMatch[1] : '';

const bodyMatch = adminHtml.match(/<body>([\s\S]*?)<script>/);
const bodyHtml = bodyMatch ? bodyMatch[1] : '';

if (!fs.existsSync('app/admin')) {
  fs.mkdirSync('app/admin', { recursive: true });
}

const pageTsx = `"use client";
import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Run the extracted script
    const script = document.createElement('script');
    script.src = '/admin_script.js';
    document.body.appendChild(script);
    
    // Set admin specific body styles that conflict with globals.css
    const originalBg = document.body.style.background;
    const originalOverflow = document.body.style.overflow;
    document.body.style.background = '#0D0D0D';
    document.body.style.overflow = 'hidden';

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      document.body.style.background = originalBg;
      document.body.style.overflow = originalOverflow;
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${css.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
      <div dangerouslySetInnerHTML={{ __html: \`${bodyHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
    </>
  );
}
`;
fs.writeFileSync('app/admin/page.tsx', pageTsx);

fs.writeFileSync('public/admin_script.js', js);

console.log('Migration completed for admin.html!');
