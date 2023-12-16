import prisma from "@/lib/prisma"
import RecipeCard from "./components/RecipeCard"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello {session?.user?.name}</h1>
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
