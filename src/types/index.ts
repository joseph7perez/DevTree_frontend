// Type de User que se almacena en la BD
export type User = {
    handle: string,
    name: string,
    email: string,
    _id: string,
    description: string,
    image: string,
    links: string
}

//Seleccionamos solo los necesarios para el registro
export type RegisterForm = Pick<User, 'handle' | 'name' | 'email'> & {
    password: string,
    password_confirmation: string,
}

//Seleccionamos solo los necesarios para el login
export type LoginForm = Pick<User, 'email'> & {
    password: string,
}

//Seleccionamos solo los necesarios para la seccion de profile
export type ProfileForm = Pick<User, 'handle' | 'description'>

// Type de social que se almacena en la BD
export type SocialNetwork = {
    id: number,
    name: string,
    url: string,
    enabled: boolean
}

// Para mostrar la info en la pag para cada usuario
export type UserHandle = Pick<User, 'handle' | 'name' | 'description' | 'image' | 'links'>

export type DevTreeLink = Pick<SocialNetwork, 'name' | 'url' | 'enabled'>

