import { useContext } from 'react'
import { AuthContext, AuthContextProps } from '../contexts/Auth'

export function useAuth (): AuthContextProps {
  const context = useContext(AuthContext)
  return context
}
