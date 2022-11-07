import { createContext, ReactNode, useState, useEffect } from 'react'
import { api } from '../services/api'

import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string
  avatarUrl: string
}

export interface AuthContextProps {
  user: UserProps
  signIn: () => Promise<void>
  isUserLoading: boolean
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function AuthContextProvider ({ children }: AuthContextProviderProps) {
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [user, setUser] = useState<UserProps>({} as UserProps)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '256358915863-kplt6ofs28egqg46aeu5upgdrufg88bc.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn () {
    try {
      setIsUserLoading(true)
      await promptAsync()
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle (accessToken: string) {
    try {
      setIsUserLoading(true)

      const tokenResponse = await api.post('/users', { accessToken })
      api.defaults.headers.common.Authorization = `Bearer ${tokenResponse.data.token as string}`

      const userInfoResponse = await api.get('/me')
      setUser(userInfoResponse.data.user)
    } catch (error) {
      console.log(error)
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response?.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isUserLoading,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
