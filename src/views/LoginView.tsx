import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../components/ErrorMessage";
import type { LoginForm } from "../types";
import api from "../config/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export default function LoginView() {

    const navigate = useNavigate()

    const initialValues : LoginForm = {
      email: "",
      password: "",
    }

  //Obtenemos los metodos de useForm
  const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues});

  const handleLogin = async (formData : LoginForm) => {
    try {
      const {data} = await api.post(`/auth/login`, formData);

      localStorage.setItem('AUTH_TOKEN', data); //AUTH_TOKEN, es el nombre con el que vamos a acceder y se va almacenar
      navigate('/admin') // Redirecionar al usuario a admin

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error); //Obtener el error del backend y verlo en consola    
      }
    }
  }

  return (
    <>
      <h1 className="text-white font-bold text-3xl text-center mb-6">
        Iniciar Sesión
      </h1>

      <form 
          onSubmit={handleSubmit(handleLogin)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-8 rounded-2xl shadow-xl space-y-6"
          noValidate
      >
          <div className="space-y-2">
              <label htmlFor="email" className="text-lg text-slate-300 font-medium">E-mail</label>
              <input
                  id="email"
                  type="email"
                  placeholder="Email de Registro"
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-400 border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition"
                  {...register("email", {
                      required: "El Email es obligatorio",
                      pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Correo no válido",
                      },
                  })}
              />
              {errors.email && (
                  <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
          </div>
          <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="password" className="text-lg text-slate-300 font-medium">Contraseña</label>
              <input
                  id="password"
                  type="password"
                  placeholder="Contraseña registrada"
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-400 border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition"
                  {...register("password", {
                      required: "El Password es obligatorio",
                  })}
              />
              {errors.password && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
          </div>

          <input
              type="submit"
              className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
              value='Iniciar Sesión'
          />
      </form>

      <nav className="mt-8">
        <Link className="text-center text-white text-lg block" to="/auth/register">No tengo cuenta</Link>
      </nav>
    </>
  )
}
