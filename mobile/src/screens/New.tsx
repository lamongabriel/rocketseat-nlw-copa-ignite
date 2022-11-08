import { useState } from 'react'
import { Heading, Text, VStack, useToast } from 'native-base'

import { api } from '../services/api'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

import Logo from '../assets/logo.svg'
import { useNavigation } from '@react-navigation/native'

export function New () {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { navigate } = useNavigation()

  const toast = useToast()

  async function handlePoolCreate () {
    if (!title.trim()) {
      return toast.show({
        title: 'Invalid pool name.',
        placement: 'top',
        bgColor: 'red.500'
      })
    }

    try {
      setIsLoading(true)

      await api.post('/pools', { title })

      toast.show({
        title: 'Succesfully created pool.',
        placement: 'top',
        bgColor: 'green.500'
      })

      setTitle('')
      navigate('pools')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Create new pool'/>

      <VStack mt={8} mx={5} alignItems='center'>
        <Logo />

        <Heading fontFamily='heading' color='#fff' fontSize='xl' my={8} textAlign='center'>
          Create your own sweepstake of the World Cup and share it with your friends
        </Heading>

        <Input mb={2} placeholder='Name your pool' value={title} onChangeText={setTitle}/>

        <Button title='CREATE MY POOL' onPress={handlePoolCreate} isLoading={isLoading} />

        <Text color='gray.200' fontSize='sm' textAlign='center' px={10} mt={4}>
          After you create your sweepstake, you will receive a unique code to a pool that you can send to all of your friends 🚀
        </Text>

      </VStack>

    </VStack>
  )
}
