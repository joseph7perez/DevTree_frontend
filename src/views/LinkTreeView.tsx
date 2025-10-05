import { useEffect, useState } from "react"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";
import type { User, SocialNetwork } from "../types";


export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social);  

  const queryClient = useQueryClient();
  const user : User = queryClient.getQueryData(['user'])!; // Obtener el usuario en cache

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Actualizado correctamente')
    } 
  })

  
  useEffect(() => {
    const updatedData = devTreeLinks.map(item => {
      const userLink = JSON.parse(user.links).find( (link: SocialNetwork) => link.name === item.name); //JSON.parse, convertir a arreglo

      if (userLink) {
        return { ...item, url: userLink.url, enabled: userLink.enabled}
      }
      return item
    })

    setDevTreeLinks(updatedData);    

  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    // console.log(e.target.name);

    // Ver lo que escribimos
    const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? {...link, url: e.target.value} : link)
    setDevTreeLinks(updatedLinks);    
  }

  const links: SocialNetwork[] = JSON.parse(user.links)

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link => {
      if(link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return {...link, enabled: !link.enabled} // !link.enabled, asignarle el valor contrario al que tiene
        } else {
          toast.error('El formato de la URL no es válido')
        }
      } 
      return link; 
    });

  
    
    // console.log(updatedLinks);

    let updatedItems: SocialNetwork[] = []

    const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork);

    if(selectedSocialNetwork?.enabled){
      const id = links.filter(link => link.id).length + 1;
      //Comprobar si la red social ya esta en el arreglo
      if (links.some(link => link.name === socialNetwork)) { 
        //console.log('Ya existe en el arreglo');
        updatedItems = links.map(link => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id
            }
          } else {
            return link
          }
        })
        
      } else {
          const newItem = {
        ...selectedSocialNetwork,
          id
        }

        updatedItems = [...links, newItem]
      }
    
    } else {
      // Si la esta deshabilitando la sacamos del arreglo de los links
      const indexToUpdate = links.findIndex(link => link.name === socialNetwork)

      updatedItems = links.map(link => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false
          }
        } else if(link.id > links[indexToUpdate].id){
          return {
            ...link,
            id: link.id - 1
          }
        } else {
          return link
        }
      })
    //  console.log(indexToUpdate);
      
    }
     
  //  console.log(updatedItems);
    
    // Seteo en el state
    setDevTreeLinks(updatedLinks)

    // Actualizar los datos cacheados y almacenarlos en la BD, los links
    queryClient.setQueryData(['user'], (prevData: User) =>{
      return {
          ...prevData, // Copia a prevData para mantener los datos cacheados
          links: JSON.stringify(updatedItems)
      }
    })
  }

  return (
    <div className="space-y-5">
      {devTreeLinks.map(item => (
        <DevTreeInput 
          key={item.name}
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnableLink={handleEnableLink}
        />
      ))}
      <button 
        className="bg-cyan-400 p-2 text-lg w-full uppercase font-bold rounded text-slate-600"
        onClick={() => mutate(queryClient.getQueryData(['user'])!)}
      >Guardar Cambios</button>
    </div>
  )
}
