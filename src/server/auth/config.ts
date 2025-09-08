import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { env } from '~/env';
// import DiscordProvider from "next-auth/providers/discord";

import { db } from '~/server/db';
import { accounts, sessions, users, verificationTokens } from '~/server/db/schema';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            username?: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession['user'];
    }

    interface User {
        accessToken?: string;
        // ...other properties
        // role: UserRole;
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
    providers: [
        // DiscordProvider,
        GithubProvider({
            clientId: env.AUTH_GITHUB_ID as string,
            clientSecret: env.AUTH_GITHUB_SECRET as string,
            authorization: { params: { scope: 'read:user repo' } },
            // profile(profile) {
            //     // console.log('...', profile);
            //     return {
            //         id: profile.id.toString(),
            //         name: profile.name ?? profile.login,
            //         email: profile.email,
            //         image: profile.avatar_url,
            //         username: profile.login,
            //     };
            // },
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    callbacks: {
        session: ({ session, user, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    accessToken: token.accessToken as string,
                    username: token.username as string,
                },
            };
        },
        // async signIn({ user, account, profile }) {
        //     if (account?.provider === 'github' && profile) {
        //         console.log('acc>>', account);
        //         user.accessToken = account.access_token;
        //         // Store GitHub username in your users table
        //         await db
        //             .update(users)
        //             .set({
        //                 username: profile.login as string,
        //             })
        //             .where(eq(users.id, `${user.id}`));
        //     }
        //     return true;
        // },
        async jwt({ token, account, user, profile }) {
            if (account) {
                token.accessToken = account.access_token;
            }

            if (profile) {
                token.username = profile.login;
            }

            if (user) {
                token.id = user.id;
            }

            return token;
        },
    },
    session: {
        strategy: 'jwt',
    },
} satisfies NextAuthConfig;
