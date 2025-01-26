import './globals.css';

export const metadata = {
  title: 'Qué hace el Lucas?',
  description: 'Tracking de cosas que hace el lucas',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
