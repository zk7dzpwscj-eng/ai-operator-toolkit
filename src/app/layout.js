import "./globals.css";

export const metadata = {
  title: "AI Native Operator Toolkit",
  description: "Turn your messy business situation into an actionable AI-native operator plan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
