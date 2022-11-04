import { VStack, Icon } from 'native-base'
import { Octicons } from '@expo/vector-icons'

import { Button } from '../components/Button'
import { Header } from '../components/Header'

import { useNavigation } from '@react-navigation/native'

export function Pools () {
  const { navigate } = useNavigation()

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
    </VStack>
  )
}
