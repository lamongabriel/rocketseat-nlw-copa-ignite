import { useEffect, useState } from 'react'
import { Share } from 'react-native'
import { useRoute } from '@react-navigation/native'

import { HStack, useToast, VStack } from 'native-base'

import { api } from '../services/api'

import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { PoolPros } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader'
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'
import { Option } from '../components/Option'
import { Guesses } from '../components/Guesses'

interface RouteParams {
  id: string
}

export function Details () {
  const [optionSelected, setOptionSelected] = useState<'guess' | 'group'>('guess')
  const [isLoading, setIsLoading] = useState(true)
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros)

  const route = useRoute()
  const toast = useToast()
  const { id } = route.params as RouteParams

  async function handleShare () {
    await Share.share({
      message: `Hey, come join my pool at NLW Copa, a sweepstake app for the 2022 Qatar World Cup, use my code: ${poolDetails.code}`
    })
  }

  async function fetchPoolDetais () {
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${id}`)
      setPoolDetails(response.data.pool)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Error loading this pool',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPoolDetais()
  }, [id])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title={poolDetails.title} showBackButton showShareButton onShare={handleShare}/>
      {
        poolDetails?._count?.participants > 0
          ? <VStack px={5} flex={1}>
              <PoolHeader data={poolDetails} />
              <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                <Option title='Your Guesses' isSelected={optionSelected === 'guess'} onPress={() => setOptionSelected('guess')} />
                <Option title='Group Ranking' isSelected={optionSelected === 'group'} onPress={() => setOptionSelected('group')} />
              </HStack>

              <Guesses poolId={poolDetails.id} />

            </VStack>
          : <EmptyMyPoolList code={poolDetails.code} onShare={handleShare}/>
      }
    </VStack>
  )
}
