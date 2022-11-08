import { Row, Text, Pressable } from 'native-base'

interface Props {
  code: string
  onShare: () => void
}

export function EmptyMyPoolList ({ code, onShare }: Props) {
  return (
    <Row flexWrap="wrap" justifyContent="center" p={4}>
      <Text color="gray.200" fontSize="sm">
        This pool doesn't have any participants, how about
      </Text>

      <Pressable onPress={onShare}>
          <Text textDecorationLine="underline" color="yellow.500" textDecoration="underline">
          sharing the code
          </Text>
      </Pressable>

      <Text color="gray.200" fontSize="sm" mx={1}>
        of the sweepstake with somebody?
      </Text>

      <Text color="gray.200" mr={1}>
        Use the code
      </Text>

      <Text color="gray.200" fontSize="sm" textAlign="center" fontFamily="heading">
        {code}
      </Text>
    </Row>
  )
}
