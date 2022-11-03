import { Heading, Text, VStack } from 'native-base'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

import Logo from '../assets/logo.svg'

export function New () {
  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Create new pool'/>

      <VStack mt={8} mx={5} alignItems='center'>
        <Logo />

        <Heading fontFamily='heading' color='#fff' fontSize='xl' my={8} textAlign='center'>
          Create your own sweepstake of the World Cup and share it with your friends
        </Heading>

        <Input mb={2} placeholder='Name your pool'/>

        <Button title='CREATE MY POOL' />

        <Text color='gray.200' fontSize='sm' textAlign='center' px={10} mt={4}>
          After you create your sweepstake, you will receive a unique code to a pool that you can send to all of your friends 🚀
        </Text>

      </VStack>

    </VStack>
  )
}
