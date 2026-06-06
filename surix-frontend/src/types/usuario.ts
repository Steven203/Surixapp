export type Usuario = {
  id: number
  username: string
  roles: string[]
}

export type Role = {
    id: number
    nombre: string
}

export type UsuarioCreateData = {
  username: string
  password: string
}

export type UsuarioUpdateData = {
  username: string
  password?: string
}