import { useEffect, useState } from 'react';
import './LoginForm.css'
import { AuthenticateService } from '../../services/backend/authenticate';
import { ApiError } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { useLoading } from '../../hooks/useLoading';

export default function LoginForm() {
  const navigate = useNavigate()
  const { loading, start, stop } = useLoading()

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    document.title = "ISS | Login"
  }, [])

  function getLoginErrorMessage(err) {
    if (err instanceof ApiError) {
      if (err.code === 'INVALID_CREDENTIALS') return 'E-mail ou senha inválidos.'
      if (err.code === 'INVALID_PORTAL_URL') return 'Portal indisponível. Verifique a URL configurada.'
      if (err.code === 'INTERNAL_SERVER_ERROR') return 'Erro interno do servidor. Tente novamente.'
      if (err.status === 400) return 'Dados inválidos. Verifique os campos informados.'
      return err.message || 'Erro inesperado. Tente novamente.'
    }

    return 'Erro inesperado. Tente novamente.'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    start()

    try {
      setError("")

      await AuthenticateService({
        email,
        password: pass
      })

      navigate('/tickets')
    } catch (err) {
      setError(getLoginErrorMessage(err))
    } finally {
      stop()
    }
  }

  if (loading) {
    return (
      <div className="login-loading">
        <Loader />
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src="/biglogo.svg" alt="ISS" />
        </div>
        <div className="login-header">
          <h1>Portal de Tickets ISS</h1>
          <p>Entre com suas credenciais corporativas para continuar.</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-field" htmlFor="logemail">
            <span>E-mail</span>
            <input
              type="email"
              name="logemail"
              id="logemail"
              placeholder="seu.email@empresa.com"
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          <label className="login-field" htmlFor="logpass">
            <span>Senha</span>
            <input
              type="password"
              name="logpass"
              id="logpass"
              placeholder="Digite sua senha"
              autoComplete="off"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </label>
          {error ? <p className="login-error" aria-live="polite">{error}</p> : null}
          <button type="submit" className="login-submit">Acessar</button>
        </form>
        <div className="login-footer">
          Acesso restrito para membros autorizados.
        </div>
      </div>
    </div>
  )
}
