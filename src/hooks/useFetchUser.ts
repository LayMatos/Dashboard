import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

const fetchUser = async (cpf: string | null) => {
  const token = localStorage.getItem('token')

  const response = await axios.get(`${BASE_URL}/api/user/cpf/${cpf}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const useFetchUser = (cpf: string | null) => {
  const query = useQuery({
    queryKey: ['sgpm_users', cpf],
    queryFn: () => fetchUser(cpf),
    enabled: !!cpf // A query só roda se CPF estiver definido
  })

  return query
}
