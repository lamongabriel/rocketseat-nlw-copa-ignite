import { Center, Icon, Text } from 'native-base'
import { Button } from '../components/Button'
import { Fontisto } from '@expo/vector-icons'

import Logo from '../assets/logo.svg'

import { useAuth } from '../hooks/useAuth'

export function SignIn () {
  const { signIn } = useAuth()

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40}/>
      <Button
        title='SIGN IN WITH GOOGLE'
        leftIcon={<Icon as={Fontisto} name='google' color='white' size='md' />}
        type='RED'
        mt={12}
        onPress={signIn}
      />
      <Text color='gray.200' textAlign='center' mt={4}>
        We do not use any other information besides{'\n'}your e-mail to create your account.
      </Text>
    </Center>
  )
}
