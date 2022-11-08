import { useEffect, useState } from 'react'
import { useToast, FlatList } from 'native-base'

import { api } from '../services/api'

import { GameProps, Game } from '../components/Game'
import { Loading } from './Loading'

interface Props {
  poolId: string
}

export function Guesses ({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondaTeamPoints] = useState('')
  const [games, setGames] = useState<GameProps[]>([])

  const toast = useToast()

  async function fetchGames () {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${poolId}/matches`)
      setGames(response.data.matches)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Error finding matches for this pool.',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm (gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Please fill the scoreboard correctly.',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/pools/${poolId}/matches/${gameId}/guesses`, {
        firstTeamGoals: Number(firstTeamPoints),
        secondTeamGoals: Number(secondTeamPoints)
      })

      toast.show({
        title: 'Guess created succesfully.',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames()
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Error sending your guess.',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={ ({ item }) => (
        <Game data={item} setFirstTeamPoints={setFirstTeamPoints} setSecondTeamPoints={setSecondaTeamPoints} onGuessConfirm={async () => await handleGuessConfirm(item.id)} />
      )}
      />
  )
}
