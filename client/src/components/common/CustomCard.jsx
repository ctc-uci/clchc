import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'

export const CustomCard = ({ title, body, footer, height, width }) => {
  return (
    <Card
        w={width}
        h={height}
        flexShrink={1}
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="sm"
        _hover={{ boxShadow: 'md' }}
        transition="box-shadow 0.2s ease"
    >
      
        <CardHeader pb={1}>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {title}
            </Text>
        </CardHeader>

        <CardBody py={2}>
            <Text fontSize="3xl" fontWeight="semibold" color="gray.900">
                {body}
            </Text>
        </CardBody>

        <CardFooter pt={1}>
            <Text fontSize="sm" color="gray.500">
                {footer}
            </Text>
        </CardFooter>
    </Card>
  )
}
