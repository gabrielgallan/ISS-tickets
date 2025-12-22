import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";
import Loader from "../../components/Loader/Loader";

export default function RootPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await getTickets()

        // se chegou aqui = autenticado
        navigate("/tickets")
      } catch (e) {
        console.log("Sem sessão válida → mostrando login")
        setChecking(false)
      }
    }

    checkSession()
  }, [])

  if (checking) return <Loader />

  return <LoginForm />
}
