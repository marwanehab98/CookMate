import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

/*
The api route of the register-user POST request.
It takes the name, email, password, and confirmPassword fields of the user in the request's body.
If the password does not match confirmPassword it return null.
If the user already exists it returns null.
Otherwise it hashes the password and creates a new user entry in the database and returns the user without the password in the response.
*/
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, confirmPassword } = body

        if (password !== confirmPassword) {
            return NextResponse.json({ user: null, message: "Passwords don't match" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return NextResponse.json({ user: null, message: "Email is already registered" }, { status: 409 })
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            }
        })

        const { password: userPassword, ...userData } = newUser

        return NextResponse.json({ user: userData, message: "Registered user" }, { status: 201 })
    } catch (error) {

        return NextResponse.json({ user: null, message: error }, { status: 201 })
    }
}