import { useCallback, useState } from 'react'
import { VStack, Icon, useToast, FlatList } from 'native-base'
import { Octicons } from '@expo/vector-icons'

import { api } from '../services/api'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { PoolCard, PoolPros } from '../components/PoolCard'
import { Loading } from '../components/Loading'
import { EmptyPoolList } from '../components/EmptyPoolList'

import { useNavigation, useFocusEffect } from '@react-navigation/native'

export function Pools () {
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState<PoolPros[]>([])

  const { navigate } = useNavigation()
  const toast = useToast()

  async function fetchPools () {
    setIsLoading(true)
    try {
      const response = await api.get('/pools')

      setPools(response.data.pools)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Error loading your pools',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools()
  }, []))

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='My pools' />
      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.600' pb={6} mb={6}>
        <Button
          title='SEARCH POOL BY CODE'
          leftIcon={<Icon as={Octicons} name='search' color='black' size='md' />}
          onPress={() => navigate('find')}
        />
      </VStack>

      {
        isLoading
          ? <Loading />
          : <FlatList
            data={pools}
            ListEmptyComponent={() => <EmptyPoolList />}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PoolCard data={item} onPress={() => navigate('details', { id: item.id })} />
            )}
            px={5}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 10 }}
          />
      }

    </VStack>
  )
}
