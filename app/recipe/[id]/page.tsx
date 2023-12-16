import prisma from "@/lib/prisma"

async function getRecipe(id: string) {
    return await prisma.recipe.findUnique({
        where: {
            id: id,
        },
        include: {
            author: {
                select: { name: true }
            }
        }
    })
}

export default async function Recipe({ params }: { params: { id: string } }) {
    const recipe = await getRecipe(params.id)

    return <div>My Post: {recipe?.title}</div>
}