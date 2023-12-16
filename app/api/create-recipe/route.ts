import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, ingredients, instructions, email } = body;

        const user = await prisma.user.findUnique({
            where: { email: email }
        })

        if (user) {
            const result = await prisma.recipe.create({
                data: {
                    title,
                    instructions,
                    ingredients,
                    authorId: user.id,
                    published: true
                }
            })

            return NextResponse.json({ result })
        }
        
        return NextResponse.json(null)

    } catch (error) {
        console.log(error)
    }

}