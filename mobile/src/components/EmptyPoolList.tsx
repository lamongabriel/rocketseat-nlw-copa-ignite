import { useNavigation } from '@react-navigation/native'
import { Row, Text, Pressable } from 'native-base'

export function EmptyPoolList () {
  const { navigate } = useNavigation()

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        You are still not participating of any pool, how about
      </Text>

      <Pressable onPress={() => navigate('find')}>
          <Text textDecorationLine="underline" color="yellow.500" textDecoration="underline">
            searching for a code
          </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center" mx={1}>
        or
      </Text>

      <Pressable onPress={() => navigate('new')}>
        <Text textDecorationLine="underline" color="yellow.500">
          creating a new one
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center">
        ?
      </Text>
    </Row>
  )
}
