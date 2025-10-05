import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";

export default function AppLayout() {

    const {data, isLoading, isError} = useQuery({
        queryFn: getUser, //Funcion a ejecutar
        queryKey: ['user'],
        refetchOnWindowFocus: false,
        retry: 1
    })

    if(isLoading) return 'Cargando...';

    // //Si hay un error redireccionamos al usuario al login
    if (isError) {
        return <Navigate to={'/auth/login'} />
    }  

    if(data) return <DevTree data={data}/>
}