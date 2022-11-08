import { useCallback, useState } from 'react'
import { Heading, useToast, VStack } from 'native-base'

import { api } from '../services/api'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

export function Find () {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const toast = useToast()
  const { navigate } = useNavigation()

  async function handlePoolJoin () {
    try {
      setIsLoading(true)
      if (!code.trim()) {
        return toast.show({
          bgColor: 'red.500',
          placement: 'top',
          title: 'Please enter a code below.'
        })
      }

      await api.post('pools/join', { code: code.toUpperCase() })

      setCode('')
      navigate('pools')
    } catch (error) {
      setIsLoading(false)
      if (error.response?.data?.message === 'Pool not found.') {
        return toast.show({
          bgColor: 'red.500',
          placement: 'top',
          title: 'Could not find your pool.'
        })
      }
      if (error.response?.data?.message === 'You already joined this pool.') {
        return toast.show({
          bgColor: 'red.500',
          placement: 'top',
          title: 'You are already a member of this pool.'
        })
      }
    }
  }

  useFocusEffect(useCallback(() => {
    setIsLoading(false)
  }, []))

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Search by code' showBackButton/>

      <VStack mt={8} mx={5} alignItems='center'>

        <Heading fontFamily='heading' color='#fff' fontSize='xl' mb={8} textAlign='center'>
          Pool search
        </Heading>

        <Input
          mb={2}
          placeholder="What's the code?"
          value={code}
          onChangeText={setCode}
          autoCapitalize='characters'
        />

        <Button title='SEARCH' isLoading={isLoading} onPress={handlePoolJoin} />

      </VStack>

    </VStack>
  )
}
