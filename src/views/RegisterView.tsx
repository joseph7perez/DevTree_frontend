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
     <h1 className="text-white font-bold text-3xl text-center mb-6">
        Crear una cuenta
      </h1>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* Nombre */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-lg text-slate-300 font-medium">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre completo"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-400 border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition"
            {...register("name", {
              required: "El nombre es obligatorio",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-lg text-slate-300 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-400 border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Correo no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Usuario */}
        <div className="space-y-2">
          <label htmlFor="handle" className="text-lg text-slate-300 font-medium">
            Usuario
          </label>
          <input
            id="handle"
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-400 border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition"
            {...register("handle", {
              required: "El nombre de usuario es obligatorio",
            })}
          />
          {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
        </div>

        {/* Contraseña */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-lg text-slate-300 font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-400 border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "Debe contener mínimo 8 caracteres",
              },
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        {/* Confirmar contraseña */}
        <div className="space-y-2">
          <label
            htmlFor="password_confirmation"
            className="text-lg text-slate-300 font-medium"
          >
            Confirmar contraseña
          </label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite la contraseña"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-400 border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition"
            {...register("password_confirmation", {
              required: "La confirmación es obligatoria",
              validate: (value) =>
                value === password || "Las contraseñas deben ser iguales",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        {/* Botón */}
        <input 
          type="submit" 
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer" 
          value='Crear Cuenta' />
      </form>

      <nav className="mt-8 text-center">
        <Link
          className="text-center text-white text-lg block"
          to="/auth/login"
        >
          Ya tengo una cuenta
        </Link>
      </nav>

    </>
  )
}
