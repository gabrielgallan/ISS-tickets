import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { getTickets } from "../services/backend/get-tickets";

export default function PageRouter() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function validate() {
      try {
        const res = await getTickets({
            perPage: 1,
            page: 1
        })

        navigate('/tickets')
      } catch {
        navigate('/login')
      } finally {
        setChecking(false)
      }
    }

    validate()
  }, [])

  if (checking) return <Loader />

  return null
}