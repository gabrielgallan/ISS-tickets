import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTickets } from "../services/backend/get-tickets";

export function useCheckAuth() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function run() {
        try {
            const res = await getTickets({
              perPage: 1,
              page: 1
            })

            console.log(res)

            if (res.code !== 200) navigate('/login')

            return
        } catch (err) {
            navigate('/login')
        }
    }

    run()
  }, [])
}
