import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { searchQuery } = body;

        console.log(body)

        const recipes = await prisma.recipe.findMany({
            where: {
                published: true,
                title: { contains: searchQuery }
            },
            include: {
                author: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json(recipes)
    } catch (error) {
        return NextResponse.json({ recipes: [], message: "Something went wrong" }, { status: 500 })
    }
}