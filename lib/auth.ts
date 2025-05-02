import { Strategy } from './../node_modules/openid-client/types/index.d';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { error } from 'console';


export const authOptions: NextAuthOptions = {
    providers: [CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { lable: "Email", type: "text" },
            password: { lable: "password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Missing Email or Password")
            }

            try {
                await connectToDatabase()
                const user = await User.findOne({ email: credentials.email })


                if (!user) {
                    throw new Error("No user found")
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isValid) {
                    throw new Error("Invalid password ")
                }
                return {
                    id: user._id.toString(),
                    email: user.email
                }

            } catch (error) {
                throw error
            }
        }
    })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                if (user) {
                    token.id = user.id
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}