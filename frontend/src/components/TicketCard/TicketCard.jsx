import './TicketCard.css'

export default function TicketCard({ ticket }) {
  return (
    <li className="ticket-card">
        ID: {ticket.ticketInfo.ticketId}
    </li>
  )
}
