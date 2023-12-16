import prisma from "@/lib/prisma"
import RecipeCard from "./components/RecipeCard"

/*
Finds and returns all published recipes in the database.
*/
async function getRecipes() {
  return await prisma.recipe.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: { name: true }
      }
    }
  })
}

export default async function Home() {
  const recipes = await getRecipes()

  return (
    <main className="flex flex-col items-center justify-between p-12">
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
