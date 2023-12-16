import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { compare } from "bcrypt";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
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
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        })
    ],
    session: {
        strategy: 'jwt'
    },
}