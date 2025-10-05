import { Link, Outlet } from "react-router-dom";
import NavigationTabs from "./NavigationTabs";
import { Toaster } from "sonner";
import type { SocialNetwork, User } from "../types";
import { useEffect, useState } from "react";
import DevTreeLink from "./DevTreeLink";
import  { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import  { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useQueryClient } from "@tanstack/react-query";
import Header from "./Header";

type DevTreeProps  = {
    data : User
}

export default function DevTree({data}: DevTreeProps) {

    const [enablesLinks, setEnabledLinks] = useState<SocialNetwork[]>(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    
   // console.log(enablesLinks);
    
    useEffect(() => {
        setEnabledLinks(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    }, [data])

    const queryClient = useQueryClient()  

    const handleDragEnd = (e: DragEndEvent) => {
        // console.log(e.active); //e.active, elemento que se esta arrastrando
        // console.log(e.over); //e.over, en donde se solto el elemento

        const { active, over } = e

        if (over && over.id) {
            const prevIndex = enablesLinks.findIndex(link => link.id === active.id)
            const newIndex = enablesLinks.findIndex(link => link.id === over.id)

            const order = arrayMove(enablesLinks, prevIndex, newIndex)

            setEnabledLinks(order);

            // Obtener los links deshabilitados
            const disabledLinks: SocialNetwork[] = JSON.parse(data.links).filter((item: SocialNetwork) => !item.enabled)
           // console.log(disabledLinks);
            
            const links = order.concat(disabledLinks); //Unir los enlaces en un arreglo, habilitados y deshabilitados

            queryClient.setQueryData(['user'] ,(prevData: User) => {

                return {
                    ...prevData, 
                    links: JSON.stringify(links)
                }
            })
            
        }
    }
    
    return (
        <>
            <Header />

            <div className="bg-gray-100  min-h-screen py-10">
                <main className="mx-auto max-w-5xl p-10 md:p-0">

                    <NavigationTabs />
                    
                    <div className="flex justify-end">
                        <Link 
                            className="font-bold text-right text-slate-800 text-2xl"
                            to={`/${data.handle}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >Visitar Mi Perfil: {data.handle}</Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1 ">
                            <Outlet />
                        </div>
                        <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
                            <p className="text-4xl text-white text-center">{data.handle}</p>
                            <p className="text-center text-2sm text-white font-bold">{data.name}</p>
                            
                            {/* Si hay una imagen que la muestre */}
                            {data.image && 
                                <img src={data.image} alt="Imagen Perfil" className="mx-auto max-w-[250px]"/>                    
                            }

                            <p className="text-center text-lg text-white font-bold">{data.description}</p>

                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >

                                <div className="mt-20 flex flex-col gap-5">
                                    <SortableContext
                                        items={enablesLinks}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {
                                            enablesLinks.map(link => (
                                                <DevTreeLink key={link.name} link={link}/> 
                                            ))
                                        }
                                    </SortableContext>
                                </div>
                            </DndContext>

                            
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" richColors/> 
        </>
 
    )
}
