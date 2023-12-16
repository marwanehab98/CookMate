import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

/*
The route for the create-recipe POST request.
It takes the title, ingredients, instructions, and the email of the user in the requests body.
If the user exists, is creates an entry in the database with the new recipe and return the recipe as the respone.
Otherwise it returns null.
*/
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