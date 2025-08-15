// import { useEffect, useState } from "react"
// import { Outlet } from "react-router-dom"
// import kc from "../src/service/keycloak"

// const ProtectedRoutes = () => {
//   const [authenticated, setAuthenticated] = useState<boolean | null>(null)

//   useEffect(() => {
//     if (kc.authenticated !== undefined) return // Evita reinicialização

//     kc.init({
//       onLoad: "login-required",
//       checkLoginIframe: true,
//       pkceMethod: "S256",
//     })
//       .then((auth) => {
//         setAuthenticated(auth)
//         if (!auth) {
//           window.location.reload()
//         } else {
//           console.info("Authenticated")
//           // console.log("Access Token:", kc.token)

//           kc.onTokenExpired = () => {
//             console.log("Token expired, refreshing...")
//             kc.updateToken(30).catch(() => {
//               console.error("Failed to refresh token")
//             });
//           };
//         }
//       })
//       .catch(() => {
//         console.error("Authentication Failed")
//         setAuthenticated(false)
//       })
//   }, [])

//   if (authenticated === null) {
//     return <p>Verificando autenticação...</p>; // Exibe enquanto verifica a autenticação
//   }

//   if (!authenticated) {
//     return <p>Erro ao conectar com o servidor de autenticação.</p>
//   }

//   return <Outlet />
// }

// export default ProtectedRoutes

export {};