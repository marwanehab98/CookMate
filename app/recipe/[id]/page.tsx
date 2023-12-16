import prisma from "@/lib/prisma"

/*
This function finds a specific recipe in the database using it's id
*/
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

    return (
        <main className="flex min-h-screen flex-col items-start justify-start p-24">
            <h1 className="ml-2 text-5xl font-bold tracking-widest text-primary uppercase">{recipe?.title}</h1>
            <h2 className="ml-2 font-bold tracking-widest text-primary">{recipe?.author?.name}</h2>

            <h1 className="ml-2 font-bold mt-12 mb-4 text-7xl">Ingredients</h1>

            <ul className="ml-2">
                {recipe?.ingredients.map((ingredient) => {
                    return <li className="ml-2 tracking-widest text-primary">{ingredient}</li>
                })}
            </ul>

            <h1 className="ml-2 font-bold mt-12 mb-4 text-7xl">Instructions</h1>

            <h1 className="ml-2 tracking-widest text-primary">{recipe?.instructions}</h1>
        </main>
        )
}