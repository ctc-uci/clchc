import { CustomCard } from "./customCard";
import { Heading, Text, InputGroup, InputLeftElement, Input} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'
export const QuotaTracking = () => {
    return (
    <>
        <Heading>
            Quota Tracking
            <Text>
                Monitor daily appointment progress across all providers
            </Text>
        </Heading>
        <CustomCard title="Title" body="Body" footer="Footer"/>
        <InputGroup>
            <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input placeholder='Search Providers' />
        </InputGroup>
    </>
    );
}