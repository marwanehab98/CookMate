import RecipeCard from "@/app/components/RecipeCard"
import prisma from "@/lib/prisma"

/*
Finds and returns all published recipes in the database where 
the title, ingredients, or instructions contain the search query.
*/
async function getRecipes(query: string) {
    return await prisma.recipe.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { ingredients: { has: query } },
                { instructions: { contains: query, mode: 'insensitive' } }
            ]
        },
        include: {
            author: {
                select: { name: true }
            }
        }
    })
}

export default async function Recipe({ params }: { params: { query: string } }) {
    const recipes = await getRecipes(params.query)

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex items-start justify-center lg:h-screen">
                <div className="container mx-auto mx-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-24">
                        {recipes.map((recipe) => {
                            return <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} ingredients={recipe.ingredients}></RecipeCard>
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}