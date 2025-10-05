import { useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, uploadImage } from "../api/DevTreeAPI";
import type { ProfileForm, User } from "../types";
import { toast } from "sonner";

export default function ProfileView() {

    const queryClient = useQueryClient(); // Tenemos acceso a los datos cacheados 
    const data : User = queryClient.getQueryData(['user'])! //Le pasamos el queryKey al que queremos acceder - el "!" es para decirle que si va a existir el usuario    

    //Obtenemos los metodos de useForm
    const { register, handleSubmit, formState: {errors} } = useForm<ProfileForm>({defaultValues: {
        handle: data.handle,
        description: data.description
    }});

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile, //Funcion a ejecutar
        onError: (error) => {
            toast.error(error.message); // Accedemos al error del backend y se muestra
        }, 
        onSuccess: (data) => { // data es el mensaje que obtenemos de la funcion (el mensaje del handler)
            toast.success(data);
            queryClient.invalidateQueries({queryKey: ['user']}) // Actualiza los datos instantaneamente en la vista
        }
    })

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage, //Funcion a ejecutar
        onError: (error) => {
            toast.error(error.message); // Accedemos al error del backend y se muestra
        }, 
        onSuccess: (data) => { // data es la URL de la img
             
            // Mostrar la imagen al instante que el usuario guarde cambios
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData, // Copia a prevData para mantener los datos cacheados
                    image: data.image 
                }
            }) 
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Llamamos la mutation cuando el usuario haga cambios en la imagen
            uploadImageMutation.mutate(e.target.files[0]); // e.target.files, son los archivos que el usuario selecciona, podemos ver la info
        }
    }

    const handleUserProfileForm = (formData: ProfileForm) => {   
        const user : User = queryClient.getQueryData(['user'])!; // Obtener el usuario en cache
       
        // Actualizar el user en cache
        user.description = formData.description;
        user.handle = formData.handle;

        updateProfileMutation.mutate(user) // Así llamamos la función
    }

    return (
        <form 
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Nombre de Usuario:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Nombre de Usuario"
                    {...register('handle',{
                        required: 'El nombre de usuario es obligatorio'
                    })}
                />

                {errors.handle && (
                    <ErrorMessage>{errors.handle.message}</ErrorMessage>     
                )}

            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register('description')}
                />

            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={ handleChange }
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>
    )
}