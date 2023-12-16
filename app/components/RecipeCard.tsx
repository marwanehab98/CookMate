import Link from "next/link"
import { FC } from "react"

/*
Interface defining the shape of the props object for the RecipeCard component
*/
interface CardProps {
    id: string,
    title: string,
    ingredients: string[]
}

const RecipeCard: FC<CardProps> = ({ id, title, ingredients }: CardProps) => {
    return (
        <div className="relative flex justify-between w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
            <div className="p-6">
                <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                    {title}
                </h5>
                <ul>
                    {ingredients.map((ingredient) => {
                        return <li key={ingredient} className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">{ingredient}</li>
                    })}
                </ul>
            </div>
            <div className="p-6 pt-0">
                <Link
                    href={`/recipe/${id}`}
                    className="select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    data-ripple-light="true"
                >
                    Read More
                </Link>
            </div>
        </div>
    )
}

export default RecipeCard