import { useEffect, useState } from "react";
import { getTickets } from "../../services/backend/get-tickets";
import { useNavigate } from "react-router-dom";
import { useCheckAuth } from "../../hooks/use-check-auth";

export default function Tickets() {
    useCheckAuth()

    useEffect(() => {
        document.title = "ISS | Tickets"
    }, [])

    return (
        <>Tickets...</>
    )
}
