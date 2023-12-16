'use client'
import * as yup from "yup";
import { Formik, FormikHelpers } from "formik"
import { useRouter } from "next/navigation"
import Link from "next/link";

/*
Yup schema for user registry.
It defines the name, email, password, and confirm password fields.
name is a string and is required.
email is a string with the email format and is required.
password is a string with a minimum length of 8 and is required.
confirmPassword is a string that must match the password field and is required. 
*/
const registerSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email().required("required"),
    password: yup.string().min(8).required("required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), ""], "Does not match with password!")
        .required("required")
})

/*
The initial form values which are all empty strings
*/
const initialRegisterValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
}

/*
The object type of the register form data
*/
type RegisterForm = yup.InferType<typeof registerSchema>


export default function RegisterPage() {
    const router = useRouter()

    /*
    This function handles the form submission and registering a new user.
    It takes the form data and makes an api call to the register-user api passing the data as the body of the request.
    If the request is successful and a user is returned the form is reset and the user is redirected to the sign in screen.
    */
    const handleFormSubmit = async (values: RegisterForm, onSubmitProps: FormikHelpers<RegisterForm>) => {
        try {
            const response = await fetch('/api/register-user', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                })
            })

            const user = await response.json()

            console.log(user)

            if (user) {
                onSubmitProps.resetForm()
                router.push('api/auth/signin')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialRegisterValues}
            validationSchema={registerSchema}>
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
            }) => (
                <form className="flex min-h-screen flex-col items-center justify-start p-24" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center justify-between bg-white p-12 rounded-md shadow-md">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Name
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    onError={() => { if (touched.name && errors.name) console.log(errors) }}
                                />
                                <p className="text-pink-600 text-xs italic">{errors.name}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    onError={() => { if (touched.email && errors.email) console.log(errors) }}
                                />
                                <p className="text-pink-600 text-xs italic">{errors.email}</p>

                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    onError={() => { if (touched.password && errors.password) console.log(errors) }}
                                />
                                <p className="text-pink-600 text-xs italic">{errors.password}</p>

                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword}
                                    name="confirmPassword"
                                    onError={() => { if (touched.confirmPassword && errors.confirmPassword) console.log(errors) }}
                                />
                                <p className="text-pink-600 text-xs italic">{errors.confirmPassword}</p>

                            </div>
                        </div>
                        <button
                            className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="submit">Register</button>
                        <hr className="mb-6 border-t" />
                        <div className="text-center">
                            <Link
                                className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                                href="api/auth/signin"
                            >
                                Already have an account? Login!
                            </Link>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    )
}