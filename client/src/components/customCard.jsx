import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
export const CustomCard = ({title, body, footer}) => {
    return (
        <Card>
            <CardHeader>
                {title}
            </CardHeader>
            <CardBody>
                {body}
            </CardBody>
            <CardFooter>
                {footer}
            </CardFooter>
        </Card>
    );
}