import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckAuth } from "../../hooks/useCheckAuth";
import { GetTicketsService } from "../../services/backend/get-tickets";

export default function Tickets() {
    // useCheckAuth()
    // const [tickets, setTickets] = useState([])

    useEffect(() => {
        document.title = "ISS | Tickets"

        async function run() {
            try {
                const res = await GetTicketsService({
                    perPage: 1,
                    page: 1
                })

                if (res.code !== 200) navigate('/login')
                        
                // setTickets(res.data.tickets)
                console.log(res.data.tickets)
                return
            } catch (err) {
                navigate('/login')
            }
        }

        run()
    }, [])

    return (
        <>Tickets...</>
    )
}
