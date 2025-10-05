import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import slugify from 'react-slugify'
import { useMutation } from "@tanstack/react-query";
import { searchByHandle } from "../api/DevTreeAPI";
import { Link } from "react-router-dom";

export default function SearchForm() {

    const { register, handleSubmit, watch, formState: {errors} } = useForm({
        defaultValues: {
            handle: ''
        }
    })

    const mutation = useMutation({
        mutationFn: searchByHandle
    })
 
    const handle = watch('handle') // Obtener lo que se escribe en el input

    const handleSearch = () => {
        const slug = slugify(handle)
        mutation.mutate(slug)
    }

 //   console.log(mutation);
    
    return (
        <form
            onSubmit={handleSubmit(handleSearch)}
            className="space-y-5"
        >
            <div className="relative flex items-center  bg-white  px-2">
                <label
                htmlFor="handle"
                >devtree.com/</label>
                <input
                type="text"
                id="handle"
                className="border-none bg-transparent p-2 focus:ring-0 flex-1"
                placeholder="elonmusk, zuck, jeffbezos"
                {...register("handle", {
                    required: "El Nombre de Usuario es obligatorio",
                })}
                />

            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Obtener mi DevTree'
            />

            {errors.handle && (
                <ErrorMessage>{errors.handle.message}</ErrorMessage>
            )}

            <div className="mt-10">
                {mutation.isPending && <p className="text-center">Cargando...</p>}
                {mutation.error && <p className="text-center text-red-600 font-bold">{mutation.error.message}</p>}
                {mutation.data && <p className="text-center text-cyan-500 font-bold flex items-center justify-center flex-col sm:flex-row gap-2">
                    {mutation.data}.<Link className="text-white bg-cyan-300 p-1 px-4 rounded-3xl uppercase" to={'/auth/register'} state={{handle: slugify(handle)}} >Ir a Registro</Link>
                </p>}
            </div>
        </form>
    )
}
