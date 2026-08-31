import "./globals.css";

export const metadata = {
  title: "Item CRUD Soft Delete API",
  description: "Next.js and MongoDB soft deletion API"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
