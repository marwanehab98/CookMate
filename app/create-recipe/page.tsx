'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import * as yup from "yup";
import { Formik } from "formik"
import { useState } from "react";

const recipeSchema = yup.object().shape({
    title: yup.string().required("required"),
    newIngredient: yup.string(),
    instructions: yup.string().required("required")
})

const initialRecipeValues = {
    title: "",
    newIngredient: "",
    instructions: ""
}

type RecipeForm = yup.InferType<typeof recipeSchema>


export default function CreateRecipe() {
    const router = useRouter()
    const { data: session } = useSession()
    const [ingredients, setIngredients] = useState<string[]>([])

    const handleFormSubmit = async (values: RecipeForm, onSubmitProps: any) => {
        try {
            const response = await fetch('/api/create-recipe', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    title: values.title,
                    ingredients: ingredients,
                    instructions: values.instructions,
                    email: session?.user?.email
                })
            })

            const recipe = await response.json()

            console.log(recipe)

            if (recipe) {
                onSubmitProps.resetForm()
                setIngredients([])
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (

        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialRecipeValues}
            validationSchema={recipeSchema}>
            {({
                values,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
            }) => (
                <form className="flex min-h-screen flex-col items-center justify-start p-24" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center justify-between bg-white p-12 rounded-md shadow-md w-full">
                        <div className="flex flex-wrap -mx-3 mb-6 w-full">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Title
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="title"
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.title}
                                    name="title"
                                />
                                <p className="text-pink-600 text-xs italic">{errors.title}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6 w-full">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Ingredients
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="newIngredient"
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.newIngredient}
                                    name="newIngredient"
                                />
                                <button
                                    className="middle none center rounded-lg bg-green-700 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    onClick={() => {
                                        setIngredients(v => [...v, values.newIngredient])
                                    }}>Add Ingredient</button>

                                <ul className="">
                                    {ingredients.map((ingredient) => {
                                        return <li>{ingredient}</li>
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6 w-full">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Instructions
                                </label>
                                <textarea
                                    className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none"
                                    id="instructions"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.instructions}
                                    name="instructions"
                                />
                                <p className="text-pink-600 text-xs italic">{errors.instructions}</p>

                            </div>
                        </div>
                        <button
                            className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="submit">Publish Recipe</button>
                    </div>
                </form>
            )
            }
        </Formik >
    )
}