// import { useEffect, useState } from "react"
// import { Outlet } from "react-router-dom"
// import kc from "../service/keycloak"
// import useAuthStore from "../store/userStore"
// import { useFetchUser } from "../hooks/useFetchUser"
// import React from 'react';


// const ProtectedRoutes = () => {
//   const { login } = useAuthStore()
//   const [authenticated, setAuthenticated] = useState<boolean | null>(null)
//   const [cpf, setCpf] = useState<string | null>(null)

//   const { data } = useFetchUser(cpf); console.log('####### userFetch', data, cpf)
  
//   useEffect(() => {
//     if (kc.authenticated !== undefined) return // Evita reinicialização

//     kc.init({
//       onLoad: "login-required",
//       checkLoginIframe: false,
//       pkceMethod: "S256",
//     })
//       .then((auth) => {
//         setAuthenticated(auth)
//         if (!auth) {
//           window.location.reload()
//         } else {
//           console.info("Authenticated")
//           console.log("Access Token:", kc.token)

//           if (kc.token) {
//             const userCpf = kc.tokenParsed?.preferred_username || null
//             setCpf(userCpf) 

//             // login(
//             //   {
//             //     name: kc.tokenParsed?.name || "",
//             //     isAdmin: true,
//             //     codPm: parseInt(data.result.cod_pm)
//             //   },
//             //   kc.token
//             // )
//           } 
          
//           // [ ] Fazer uma requisição para buscar no sgpm as demais informações do usuário

//           kc.onTokenExpired = () => {
//             console.log("Token expired, refreshing...")
//             kc.updateToken(30).catch(() => {
//               console.error("Failed to refresh token")
//             });
//           };
//         }
//       })
//       .catch((error) => {
//         console.error("Authentication Failed", error)
//         setAuthenticated(false)
//       })
//   }, [])

//   useEffect(() => {
//     if (data && data.result && kc.token) {
//       login(
//         {
//           name: kc.tokenParsed?.name || "",
//           // isAdmin: kc.hasResourceRole("admin"),
//           isAdmin: true,
//           codPm: parseInt(data.result.cod_pm)
//         },
//         kc.token
//       )
//     }
//   }, [data, login])

//   if (authenticated === null) {
//     return <p>Verificando autenticação...</p> // Exibe enquanto verifica a autenticação
//   }

//   if (!authenticated) {
//     return <p>Erro ao conectar com o servidor de autenticação.</p>
//   }

//   return <Outlet />
// }

// export default ProtectedRoutes

export {};
