import { useState } from "react"
import "./TicketsList.css"

function formatDate(value) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("pt-BR")
}

export default function TicketsList({ tickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [activeTab, setActiveTab] = useState("dados")

  function closeModal() {
    setSelectedTicket(null)
  }

  function openModal(ticket) {
    setSelectedTicket(ticket)
    setActiveTab("dados")
  }

  return (
    <>
      <div className="tickets-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Tipo</th>
              <th>Agente</th>
              <th>Cliente</th>
              <th>Criado em</th>
              <th>Relatórios</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketInfo.pkId}>
                <td>{ticket.ticketInfo.ticketId}</td>
                <td className="tickets-table__title">{ticket.ticketInfo.title}</td>
                <td>
                  <span className="pill pill--status">{ticket.ticketInfo.status}</span>
                </td>
                <td>{ticket.ticketInfo.priority}</td>
                <td>{ticket.ticketInfo.type}</td>
                <td>{ticket.ticketInfo.agent || "-"}</td>
                <td>{ticket.customerInfo?.title || ticket.customerInfo?.email || "-"}</td>
                <td>{formatDate(ticket.ticketInfo.createdAtUtc)}</td>
                <td>
                  <button
                    type="button"
                    className="ticket-action"
                    onClick={() => openModal(ticket)}
                    aria-label="Abrir relatório do ticket"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                      <path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket ? (
        <div className="ticket-modal" role="dialog" aria-modal="true">
          <div className="ticket-modal__overlay" onClick={closeModal} />
          <div className="ticket-modal__content">
            <div className="ticket-modal__header">
              <div>
                <h2>Relatório do Ticket</h2>
                <p>Detalhes completos do chamado selecionado</p>
              </div>
              <button type="button" className="ticket-modal__close" onClick={closeModal}>
                Fechar
              </button>
            </div>

            <div className="ticket-modal__tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "dados"}
                className={activeTab === "dados" ? "is-active" : ""}
                onClick={() => setActiveTab("dados")}
              >
                Dados
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "tabela"}
                className={activeTab === "tabela" ? "is-active" : ""}
                onClick={() => setActiveTab("tabela")}
              >
                Tabela
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "json"}
                className={activeTab === "json" ? "is-active" : ""}
                onClick={() => setActiveTab("json")}
              >
                JSON
              </button>
            </div>

            {activeTab === "dados" ? (
              <>
                <div className="ticket-modal__section">
                  <h3>Ticket</h3>
                  <div className="ticket-modal__grid">
                    <div><span>ID interno</span><strong>{selectedTicket.ticketInfo.pkId}</strong></div>
                    <div><span>Ticket</span><strong>{selectedTicket.ticketInfo.ticketId}</strong></div>
                    <div><span>Título</span><strong>{selectedTicket.ticketInfo.title}</strong></div>
                    <div><span>Status</span><strong>{selectedTicket.ticketInfo.status}</strong></div>
                    <div><span>Prioridade</span><strong>{selectedTicket.ticketInfo.priority}</strong></div>
                    <div><span>Tipo</span><strong>{selectedTicket.ticketInfo.type}</strong></div>
                    <div><span>Agente</span><strong>{selectedTicket.ticketInfo.agent || "-"}</strong></div>
                    <div><span>ID Agente</span><strong>{selectedTicket.ticketInfo.agentId}</strong></div>
                    <div><span>Criado em</span><strong>{formatDate(selectedTicket.ticketInfo.createdAtUtc)}</strong></div>
                    <div><span>Atualizado em</span><strong>{formatDate(selectedTicket.ticketInfo.modifiedAtUtc)}</strong></div>
                  </div>
                </div>

                <div className="ticket-modal__section">
                  <h3>Cliente</h3>
                  {selectedTicket.customerInfo ? (
                    <div className="ticket-modal__grid">
                      <div><span>ID</span><strong>{selectedTicket.customerInfo.id}</strong></div>
                      <div><span>Nome</span><strong>{selectedTicket.customerInfo.title}</strong></div>
                      <div><span>E-mail</span><strong>{selectedTicket.customerInfo.email}</strong></div>
                      <div><span>Telefone</span><strong>{selectedTicket.customerInfo.phone || "-"}</strong></div>
                      <div><span>Rua</span><strong>{selectedTicket.customerInfo.street || "-"}</strong></div>
                      <div><span>Nome</span><strong>{selectedTicket.customerInfo.firstName}</strong></div>
                      <div><span>Sobrenome</span><strong>{selectedTicket.customerInfo.lastName || "-"}</strong></div>
                      <div><span>Cidade</span><strong>{selectedTicket.customerInfo.city || "-"}</strong></div>
                      <div><span>País</span><strong>{selectedTicket.customerInfo.country || "-"}</strong></div>
                    </div>
                  ) : (
                    <p className="ticket-modal__empty">Nenhum dado de cliente encontrado.</p>
                  )}
                </div>
              </>
            ) : null}

            {activeTab === "tabela" ? (
              <>
                <div className="ticket-modal__section">
                  <h3>Ticket</h3>
                  <table className="ticket-modal__table">
                    <tbody>
                      <tr><td>ID interno</td><td>{selectedTicket.ticketInfo.pkId}</td></tr>
                      <tr><td>Ticket</td><td>{selectedTicket.ticketInfo.ticketId}</td></tr>
                      <tr><td>Título</td><td>{selectedTicket.ticketInfo.title}</td></tr>
                      <tr><td>Status</td><td>{selectedTicket.ticketInfo.status}</td></tr>
                      <tr><td>Prioridade</td><td>{selectedTicket.ticketInfo.priority}</td></tr>
                      <tr><td>Tipo</td><td>{selectedTicket.ticketInfo.type}</td></tr>
                      <tr><td>Agente</td><td>{selectedTicket.ticketInfo.agent || "-"}</td></tr>
                      <tr><td>ID Agente</td><td>{selectedTicket.ticketInfo.agentId}</td></tr>
                      <tr><td>Criado em</td><td>{formatDate(selectedTicket.ticketInfo.createdAtUtc)}</td></tr>
                      <tr><td>Atualizado em</td><td>{formatDate(selectedTicket.ticketInfo.modifiedAtUtc)}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="ticket-modal__section">
                  <h3>Cliente</h3>
                  {selectedTicket.customerInfo ? (
                    <table className="ticket-modal__table">
                      <tbody>
                        <tr><td>ID</td><td>{selectedTicket.customerInfo.id}</td></tr>
                        <tr><td>Nome</td><td>{selectedTicket.customerInfo.title}</td></tr>
                        <tr><td>E-mail</td><td>{selectedTicket.customerInfo.email}</td></tr>
                        <tr><td>Telefone</td><td>{selectedTicket.customerInfo.phone || "-"}</td></tr>
                        <tr><td>Rua</td><td>{selectedTicket.customerInfo.street || "-"}</td></tr>
                        <tr><td>Nome</td><td>{selectedTicket.customerInfo.firstName}</td></tr>
                        <tr><td>Sobrenome</td><td>{selectedTicket.customerInfo.lastName || "-"}</td></tr>
                        <tr><td>Cidade</td><td>{selectedTicket.customerInfo.city || "-"}</td></tr>
                        <tr><td>País</td><td>{selectedTicket.customerInfo.country || "-"}</td></tr>
                      </tbody>
                    </table>
                  ) : (
                    <p className="ticket-modal__empty">Nenhum dado de cliente encontrado.</p>
                  )}
                </div>
              </>
            ) : null}

            {activeTab === "json" ? (
              <div className="ticket-modal__section">
                <h3>JSON bruto</h3>
                <pre className="ticket-modal__json">
{JSON.stringify(selectedTicket, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}