import "./globals.css";

export const metadata = {
  title: "AI Native Operator Toolkit",
  description: "Turn your messy business situation into an actionable AI-native operator plan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

