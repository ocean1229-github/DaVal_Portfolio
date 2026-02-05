import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            // Check if email is in whitelist from environment variable
            const envWhitelist = (process.env.ADMIN_EMAILS || '')
                .split(',')
                .map(email => email.trim().toLowerCase())
                .filter(email => email.length > 0);

            // If whitelist is empty, allow all (for development)
            if (envWhitelist.length === 0) {
                console.warn('ADMIN_EMAILS is empty - allowing all logins');
                return true;
            }

            return envWhitelist.includes(user.email.toLowerCase());
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login?error=AccessDenied',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
