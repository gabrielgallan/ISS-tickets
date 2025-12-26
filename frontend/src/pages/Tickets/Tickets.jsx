import './Tickets.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetTicketsService } from "../../services/backend/get-tickets";

import TicketsList from "../../components/TicketsList/TicketsList";

export default function Tickets() {
    const [tickets, setTickets] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "ISS | Tickets"


        async function loadTickets() {
            try {
                const res = await GetTicketsService({
                    perPage: 10,
                    page: 1
                })

                if (res.code !== 200) navigate('/login')

                setTickets(res.data.tickets)
                console.log(res.data.tickets)
                return
            } catch (err) {
                navigate('/login')
            }
        }

        loadTickets()
    }, [])

    return (
        <main className="tickets-page">
            <h1 className='page-title'>Tickets</h1>
            <TicketsList tickets={tickets} />
        </main>
    )
}
