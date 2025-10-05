import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { RegisterForm } from "../types"
import ErrorMessage from "../components/ErrorMessage";
import {isAxiosError} from "axios";
import { toast } from 'sonner'
import api from "../config/axios";


export default function RegisterView() {

  const location = useLocation()  
  const navigate = useNavigate()

  const initialValues : RegisterForm = {
    name: "",
    email: "",
    handle: location?.state?.handle || "",
    password: "",
    password_confirmation: "",
  }

  //Obtenemos los metodos de useForm
  const { register, watch, reset, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues});

  //Para obtener el valor de password y compararlo mas adelante con la confirmación 
  const password = watch('password')
  
  const handleRegister = async (formData: RegisterForm) => {
    try {
      const {data} = await api.post(`/auth/register`, formData);
      toast.success(data);

      reset() //Reiniciar el formulario
      navigate('/auth/login') //Redireccionar al login
      
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error); //Obtener el error del backend y verlo en un toast    
      }
    }
  }

  return (
    <>  
    <h1 className="text-white font-bold text-3xl">Crear una cuenta</h1>

    <form 
        onSubmit={handleSubmit(handleRegister)}
        className="bg-white px-5 py-10 rounded-lg space-y-10 mt-10"
    >
        <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
            <input
                id="name"
                type="text"
                placeholder="Tu Nombre"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register('name', {
                  required: "El nombre es obligatorio"
                })}
            />

            {/* Comprobamos si existe y despues mostramos el error con el componente */}
            {errors.name && <ErrorMessage>{errors.name.message} </ErrorMessage> }

        </div>
        <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
            <input
                id="email"
                type="email"
                placeholder="Email de Registro"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register('email', {
                  required: "El Email es obligatorio",
                  pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Correo no válido",
                    },
                })}
            />

            {errors.email && <ErrorMessage>{errors.email.message} </ErrorMessage> }

        </div>
        <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="handle" className="text-2xl text-slate-500">Usuario</label>
            <input
                id="handle"
                type="text"
                placeholder="Nombre de usuario (sin espacios)"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register('handle', {
                  required: "El nombre de usuario es obligatorio"
                })}
            />

            {errors.handle && <ErrorMessage>{errors.handle.message} </ErrorMessage> }

        </div>
        <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="password" className="text-2xl text-slate-500">Contraseña</label>
            <input
                id="password"
                type="password"
                placeholder="Contraseña de Registro"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register('password', {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe contener mínimo 8 caracteres"
                  }
                })}
            />
            
            {errors.password && <ErrorMessage>{errors.password.message} </ErrorMessage> }

        </div>

        <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Confirmar Contraseña</label>
            <input
                id="password_confirmation"
                type="password"
                placeholder="Confirmar Contraseña"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register('password_confirmation', {
                  required: "La confirmación es obligatoria",
                  validate: (value) => value === password || "Las contraseñas deben ser iguales"
                })}
            />

            {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message} </ErrorMessage> }

        </div>

        <input
            type="submit"
            className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
            value='Crear Cuenta'
        />  
    </form>

    <nav className="mt-8">
      <Link className="text-center text-white text-lg block" to="/auth/login">Ya tengo una cuenta</Link>
    </nav>

    </>
  )
}
