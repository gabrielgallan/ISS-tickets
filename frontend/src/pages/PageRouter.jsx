import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { GetTicketsService } from "../services/backend/get-tickets";
import { useLoading } from "../hooks/useLoading";

export default function PageRouter() {
  const navigate = useNavigate()
  const { loading, start, stop } = useLoading()

  
  useEffect(() => {
    start()
    
    async function validate() {
      try {
        const res = await GetTicketsService({
            perPage: 1,
            page: 1
        })

        navigate('/tickets')
      } catch {
        navigate('/login')
      } finally {
        stop()
      }
    }

    validate()
  }, [])

  if (loading) return <Loader />

  return null
}