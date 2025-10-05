import { isAxiosError } from "axios";
import api from "../config/axios";
import type { ProfileForm, User, UserHandle } from "../types";

export async function getUser(){
    try {
      const {data} = await api<User>(`/user`);
      return data;
    
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error); //Obtener el error del backend y verlo en el front    
      }
    }
}

export async function updateProfile(formData: ProfileForm){
    try {
      const {data} = await api.patch<string>(`/user`, formData); //string porque es la respuesta que obtenemos (el mensaje del handler)
      
      return data;
    
    } catch (error) {
      if (isAxiosError(error) && error.response) {       
        throw new Error(error.response.data.error); //Obtener el error del backend y verlo en el front    
      }
    }
}

export async function uploadImage(file: File){
    const formData = new FormData() // Generamos el objeto de formData
    formData.append('file', file)  

    try {
      const {data} = await api.post(`/user/image`, formData); 
      return data; // URL de la img en cloudinary

    } catch (error) {
        if (isAxiosError(error) && error.response) {       
          throw new Error(error.response.data.error); //Obtener el error del backend y verlo en el front    
        }    
    }
}

export async function getUserByHandle(handle: string){
    try {
      const {data} = await api<UserHandle>(`/${handle}`); //string porque es la respuesta que obtenemos (el mensaje del handler)
      
      return data;
    
    } catch (error) {
      if (isAxiosError(error) && error.response) {       
        throw new Error(error.response.data.error); //Obtener el error del backend y verlo en el front    
      }
    }
}

export async function searchByHandle(handle: string){
    try {
      const {data} = await api.post<string>('/search', {handle}); //string porque es la respuesta que obtenemos (el mensaje del handler)
      return data
    } catch (error) {
      if (isAxiosError(error) && error.response) {       
        throw new Error(error.response.data.error); //Obtener el error del backend y verlo en el front    
      }
    }
}