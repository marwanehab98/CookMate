import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { compare } from "bcrypt";
import GitHubProvider from "next-auth/providers/github";

/*
These are the configurations for the app's NextAuth instance.
*/
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    // This is the list of supported providers for authentication
    providers: [
        // The first provider is the credentials provider, for users registered using email and password.
        // It checks if the email is already registered and if the given password matches the one in the database.
        // If it checks out the user is logged in.
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "marwan@email.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                })

                if (!existingUser) {
                    return null
                }

                const passwordMatch = await compare(credentials.password, existingUser.password || "")

                if (!passwordMatch) {
                    return null
                }

                return {
                    id: `${existingUser.id}`,
                    email: existingUser.email,
                    name: existingUser.name
                }
            }
        }),
        // This is an OAuth Github provider.
        // The user uses their Github account to login.
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        })
    ],
    session: {
        strategy: 'jwt'
    },
}