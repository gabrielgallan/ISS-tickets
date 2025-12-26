import './TicketsList.css'
import TicketCard from "../TicketCard/TicketCard"

export default function TicketsList({ tickets }) {
  return (
    <div className="list-container">
      <ul className="tickets-list">
        {tickets.map(ticket => (
          <TicketCard key={ticket.ticketInfo.pkId} ticket={ticket} />
        ))}
      </ul>
    </div>

  )
}