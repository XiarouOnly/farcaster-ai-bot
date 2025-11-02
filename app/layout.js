export const metadata = {
  title: 'Farcaster AI Bot',
  description: 'AI Bot for Farcaster',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
