import "./Tickets.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GetTicketsService } from "../../services/backend/get-tickets"
import { ApiError } from "../../services/api"
import TicketsList from "../../components/TicketsList/TicketsList"
import Loader from "../../components/Loader/Loader"

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    searchField: "tn",
    searchValue: "",
    ticketStateIds: [],
    ticketPriorityIds: [],
    ticketTypeIds: [],
    startDate: "",
    endDate: ""
  })
  const [filtersCollapsed, setFiltersCollapsed] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [pendingPerPage, setPendingPerPage] = useState(10)
  const [maxPage, setMaxPage] = useState(1)
  const hasActiveFilters =
    (filters.searchValue && filters.searchValue.trim().length > 0) ||
    filters.ticketStateIds.length > 0 ||
    filters.ticketPriorityIds.length > 0 ||
    filters.ticketTypeIds.length > 0 ||
    filters.startDate ||
    filters.endDate

  const ticketStatusOptions = [
    { id: 1, label: "Open", ids: [1, 4] },
    { id: 3, label: "Closed", ids: [3] },
    { id: 6, label: "Resolved", ids: [6] },
    { id: 8, label: "On Customer", ids: [8] },
    { id: 10, label: "On Escalation", ids: [10] }
  ]

  const ticketPriorityOptions = [
    { id: 1, label: "Low" },
    { id: 2, label: "Critical" },
    { id: 3, label: "High" },
    { id: 4, label: "Medium" }
  ]

  const ticketTypeOptions = [
    { id: 1, label: "General Question" },
    { id: 2, label: "Problem" },
    { id: 3, label: "Configuration Help" },
    { id: 4, label: "License Help" },
    { id: 5, label: "Scripting Help" },
    { id: 6, label: "Demo Setup" },
    { id: 7, label: "Sales Inquiry" }
  ]

  function toggleFilterValue(key, id) {
    setFilters((prev) => {
      const values = prev[key]
      const exists = values.includes(id)
      return {
        ...prev,
        [key]: exists ? values.filter((value) => value !== id) : [...values, id]
      }
    })
  }

  function toggleStatusFilter(option) {
    setFilters((prev) => {
      const current = prev.ticketStateIds
      const allSelected = option.ids.every((id) => current.includes(id))
      const next = allSelected
        ? current.filter((id) => !option.ids.includes(id))
        : Array.from(new Set([...current, ...option.ids]))

      return {
        ...prev,
        ticketStateIds: next
      }
    })
  }

  async function fetchTickets({ pageNumber, perPageNumber }) {
    setLoading(true)
    setError("")

    try {
      const res = await GetTicketsService({
        perPage: perPageNumber,
        page: pageNumber,
        searchField: filters.searchField,
        searchValue: filters.searchValue,
        ticketStateIds: filters.ticketStateIds,
        ticketPriorityIds: filters.ticketPriorityIds,
        ticketTypeIds: filters.ticketTypeIds,
        startDate: filters.startDate && filters.endDate ? filters.startDate : undefined,
        endDate: filters.startDate && filters.endDate ? filters.endDate : undefined
      })

      const nextTickets = res.data.tickets ?? []
      const hasMore = nextTickets.length === perPageNumber

      setTickets(nextTickets)
      setMaxPage((current) => {
        if (!hasMore) return Math.max(current, pageNumber)
        return Math.max(current, pageNumber + 1)
      })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.code === "UNAUTHORIZED_MEMBER") {
          navigate("/login")
          return
        }

        setError(err.message || "Falha ao carregar tickets.")
      } else {
        setError("Falha ao carregar tickets.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = "ISS | Tickets"

    fetchTickets({ pageNumber: 1, perPageNumber: perPage })
  }, [])

  async function applyFilters(event) {
    event.preventDefault()
    const nextPage = 1
    setPage(nextPage)
    setMaxPage(1)
    fetchTickets({ pageNumber: nextPage, perPageNumber: perPage })
  }

  function clearFilters() {
    const cleared = {
      searchField: "tn",
      searchValue: "",
      ticketStateIds: [],
      ticketPriorityIds: [],
      ticketTypeIds: [],
      startDate: "",
      endDate: ""
    }
    setFilters(cleared)
    setPage(1)
    setMaxPage(1)
    fetchTickets({ pageNumber: 1, perPageNumber: perPage })
  }

  function changePage(nextPage) {
    if (nextPage < 1 || nextPage > maxPage) return
    setPage(nextPage)
    fetchTickets({ pageNumber: nextPage, perPageNumber: perPage })
  }

  function handlePerPageChange(event) {
    const value = Number(event.target.value)
    if (!value || value < 1) return
    setPendingPerPage(Math.min(value, 200))
  }

  function applyPerPage() {
    if (!pendingPerPage || pendingPerPage < 1) return
    const nextPerPage = Math.min(pendingPerPage, 200)
    setPerPage(nextPerPage)
    setPage(1)
    setMaxPage(1)
    fetchTickets({ pageNumber: 1, perPageNumber: nextPerPage })
  }

  const totalPages = Math.max(maxPage, page + 1)
  const startPage = Math.max(1, page - 2)
  const endPage = Math.min(totalPages, page + 2)
  const pages = []
  for (let p = startPage; p <= endPage; p += 1) pages.push(p)

  return (
    <main className="tickets-page">
      <div className="tickets-header">
        <div>
          <h1 className="tickets-title">Tickets</h1>
          <p className="tickets-subtitle">Visualização consolidada dos chamados do portal.</p>
        </div>
      </div>

      <form
        className="tickets-filters"
        data-collapsed={filtersCollapsed ? "true" : "false"}
        data-has-filters={hasActiveFilters ? "true" : "false"}
        onSubmit={applyFilters}
      >
        <button
          type="button"
          className="filters-toggle"
          onClick={() => setFiltersCollapsed((prev) => !prev)}
          aria-expanded={!filtersCollapsed}
          data-has-filters={hasActiveFilters ? "true" : "false"}
        >
          <span className="filters-toggle__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/>
            </svg>
          </span>
          <span className="filters-toggle__label">Filtros</span>
          <span className="filters-toggle__chevron" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M480-360 280-560l56-56 144 144 144-144 56 56-200 200Z"/>
            </svg>
          </span>
        </button>

        <div className="filters-body">
        <div className="filters-row">
          <label className="filters-field">
            <span>Campo de busca</span>
            <select
              value={filters.searchField}
              onChange={(event) => setFilters((prev) => ({ ...prev, searchField: event.target.value }))}
            >
              <option value="tn">Ticket ID</option>
              <option value="title">Título</option>
              <option value="a_body">Descrição</option>
              <option value="company">Empresa</option>
              <option value="customer_user_id">ID do cliente</option>
              <option value="login">Login do cliente</option>
            </select>
          </label>
          <label className="filters-field">
            <span>Valor da busca</span>
            <input
              type="text"
              value={filters.searchValue}
              onChange={(event) => setFilters((prev) => ({ ...prev, searchValue: event.target.value }))}
              placeholder="Digite para buscar"
            />
          </label>
        </div>

        <div className="filters-row">
          <label className="filters-field">
            <span>Data inicial</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, startDate: event.target.value }))}
            />
          </label>
          <label className="filters-field">
            <span>Data final</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, endDate: event.target.value }))}
            />
          </label>
        </div>

        <div className="filters-row">
          <div className="filters-group">
            <span>Status</span>
            <div className="filters-options filters-options--single checkbox-wrapper-4">
              {ticketStatusOptions.map((option) => {
                const checkboxId = `filter-status-${option.id}`
                return (
                  <div key={option.id} className="checkbox-item">
                    <input
                      className="inp-cbx"
                      id={checkboxId}
                      type="checkbox"
                      checked={option.ids.every((id) => filters.ticketStateIds.includes(id))}
                      onChange={() => toggleStatusFilter(option)}
                    />
                    <label className="cbx" htmlFor={checkboxId}>
                      <span>
                        <svg width="12px" height="10px">
                          <use href="#check-4" />
                        </svg>
                      </span>
                      <span>{option.label}</span>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="filters-group">
            <span>Prioridade</span>
            <div className="filters-options filters-options--single checkbox-wrapper-4">
              {ticketPriorityOptions.map((option) => {
                const checkboxId = `filter-priority-${option.id}`
                return (
                  <div key={option.id} className="checkbox-item">
                    <input
                      className="inp-cbx"
                      id={checkboxId}
                      type="checkbox"
                      checked={filters.ticketPriorityIds.includes(option.id)}
                      onChange={() => toggleFilterValue("ticketPriorityIds", option.id)}
                    />
                    <label className="cbx" htmlFor={checkboxId}>
                      <span>
                        <svg width="12px" height="10px">
                          <use href="#check-4" />
                        </svg>
                      </span>
                      <span>{option.label}</span>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="filters-group">
            <span>Tipo</span>
            <div className="filters-options filters-options--double checkbox-wrapper-4">
              {ticketTypeOptions.map((option) => {
                const checkboxId = `filter-type-${option.id}`
                return (
                  <div key={option.id} className="checkbox-item">
                    <input
                      className="inp-cbx"
                      id={checkboxId}
                      type="checkbox"
                      checked={filters.ticketTypeIds.includes(option.id)}
                      onChange={() => toggleFilterValue("ticketTypeIds", option.id)}
                    />
                    <label className="cbx" htmlFor={checkboxId}>
                      <span>
                        <svg width="12px" height="10px">
                          <use href="#check-4" />
                        </svg>
                      </span>
                      <span>{option.label}</span>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="filters-actions">
          <button className="btn-secondary" type="button" onClick={clearFilters}>
            Limpar filtros
          </button>
          <button className="btn-primary" type="submit">
            Aplicar filtros
          </button>
        </div>

        <svg className="inline-svg" aria-hidden="true">
          <symbol id="check-4" viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1" />
          </symbol>
        </svg>
        </div>
      </form>

      {loading ? (
        <div className="tickets-state">
          <Loader />
        </div>
      ) : error ? (
        <div className="tickets-state tickets-state--error">
          <div className="tickets-state__title">Não foi possível carregar os tickets</div>
          <div className="tickets-state__message">{error}</div>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="tickets-state">
          <div className="tickets-state__title">Nenhum ticket encontrado</div>
          <div className="tickets-state__message">Ajuste os filtros ou tente novamente mais tarde.</div>
        </div>
      ) : (
        <div className="tickets-content">
          <div className="tickets-list-wrapper">
            <TicketsList tickets={tickets} />
          </div>
          <div className="tickets-pagination">
            <div className="pagination-controls">
              <button
                type="button"
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </button>
              {pages.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={p === page ? "is-active" : ""}
                  onClick={() => changePage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={page >= maxPage}
              >
                Próxima
              </button>
            </div>
            <div className="pagination-settings">
              <label className="pagination-size">
                <span>Itens por página</span>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={pendingPerPage}
                  onChange={handlePerPageChange}
                />
              </label>
              <button
                type="button"
                className="pagination-apply"
                onClick={applyPerPage}
                aria-label="Aplicar quantidade por página"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                  <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
