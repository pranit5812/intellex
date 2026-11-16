import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { AnimatedBackground } from "@/components/animated-background";
import Navbar from "@/components/component/navbar";
import { Chatbot } from "@/components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Intellex — Decentralized P2P Skill Sharing Platform",
	description: "Connect and exchange skills 1-on-1 with peers, collaborate live, and earn verifiable on-chain NFT badges.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
						<AnimatedBackground />
						<Navbar />
						<div className="min-h-[calc(100vh-4rem)] flex flex-col">{children}</div>
						<Chatbot />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
