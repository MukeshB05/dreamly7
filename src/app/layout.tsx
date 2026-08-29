import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import { site_name } from '../../config.js';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: `${site_name} - Discover Movies & TV Shows`,
    template: `%s | ${site_name}`,
  },
  description: `Discover and explore movies and TV shows with ${site_name} - a minimal, cinematic browsing experience.`,
  keywords: ['movies', 'tv shows', 'streaming', 'discover', 'trending'],
  authors: [{ name: site_name }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: site_name,
    description: 'Discover and explore movies and TV shows',
    type: 'website',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent) ||
                  (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Macintosh/.test(navigator.userAgent));

                if (isMobileOrTablet) return;

                /* 🔴 Disable Right Click */
                document.addEventListener("contextmenu", e => e.preventDefault());

                /* 🔴 Disable Keyboard Shortcuts */
                document.addEventListener("keydown", function (e) {
                  const key = e.key.toLowerCase();
                  const code = e.code.toLowerCase();
                  if (
                    e.key === "F12" ||
                    // Ctrl+Shift+I/C/J/K/U or Meta+Shift+I/C/J/K/U
                    ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i","c","j","k","u"].includes(key)) ||
                    ((e.ctrlKey || e.metaKey) && e.shiftKey && ["keyi","keyc","keyj","keyk","keyu"].includes(code)) ||
                    // Meta+Alt+I/J (Mac DevTools shortcut, Option+Command+I/J)
                    (e.metaKey && e.altKey && ["i","j"].includes(key)) ||
                    (e.metaKey && e.altKey && ["keyi","keyj"].includes(code)) ||
                    // Ctrl+U or Meta+U (View Source)
                    ((e.ctrlKey || e.metaKey) && key === "u") ||
                    ((e.ctrlKey || e.metaKey) && code === "keyu")
                  ) {
                    e.preventDefault();
                  }
                });

                /* 🔴 Disable Copy / Cut / Paste */
                ["copy","cut","paste"].forEach(event => {
                  document.addEventListener(event, e => e.preventDefault());
                });

                /* 🔴 Disable Text Selection */
                document.addEventListener("selectstart", e => e.preventDefault());

                /* 🔴 Disable Drag */
                document.addEventListener("dragstart", e => e.preventDefault());

                /* 🔴 Detect DevTools Open */
                setInterval(() => {
                  if (
                    window.outerHeight - window.innerHeight > 150 ||
                    window.outerWidth - window.innerWidth > 150
                  ) {
                    document.body.innerHTML = "<h1 style='color:white;background:black;height:100vh;display:flex;align-items:center;justify-content:center;'>DevTools not allowed</h1>";
                  }
                }, 1000);
              })();
            `
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
