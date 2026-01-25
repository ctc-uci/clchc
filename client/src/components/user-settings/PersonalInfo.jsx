import React, {useState, useEffect} from "react";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Flex,
    Grid,
    Button,
    Text
} from "@chakra-ui/react";

export default function PersonalInfo(){
    const {backend} = useBackendContext();
    const {currentUser} = useAuthContext();
    const [errorMessage, setErrorMessage] = useState("");
    const [userInfo, setUserInfo] = useState();
    useEffect(() => {
        (async() => {
            try{
                const {data} = await backend.get(`/users/${currentUser.uid}`);
                setUserInfo(data[0]);
            }
            catch (e){
                setErrorMessage(e.message);
            }
        })();
    }, []);
    if(!userInfo){return null};
    /**
     * useEffect(function, dependencyArray)
     * useEffect(() => {
     * }, [])    [] means no dependencies which means useEffect only runs the first time you render/mount
     * If you do have dependencies, it would run the effect every time the dependency changes
     */

    const updateUser = (key, value) => {
        setUserInfo(prev => ({...prev, [key]:value}))
    }

    const saveChanges = async () => {
        try {
            await backend.put(`/users/update`, userInfo);
            alert("Changes saved successfully.");
        }
        catch (e){
            setErrorMessage(e.message);
        }
    }

    /**
     * const funcName = async () => {
     *     const {content} = await promise();
     * }
     */
    
    return(
        <Grid>

            <FormControl>
                <Grid>
                    <FormLabel>First name</FormLabel>
                    <Input
                        value={userInfo.firstName}
                        onChange={(e) => updateUser("firstName", e.target.value)}
                    />
                </Grid>
            </FormControl>
            <FormControl>
                <Grid>
                    <FormLabel>Last name</FormLabel>
                    <Input
                        value={userInfo.lastName}
                        onChange={(e) => updateUser("lastName", e.target.value)}
                    />
                </Grid>
            </FormControl><FormControl>
                <Grid>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        value={userInfo.email}
                        onChange={(e) => updateUser("email", e.target.value)}
                    />
                </Grid>
            </FormControl>
            <FormControl>
                <Grid>
                    <FormLabel>Role</FormLabel>
                    <Input
                        value={userInfo.role}
                        readOnly={true}
                    />
                </Grid>
            </FormControl>
            <Button onClick={saveChanges}>Apply changes</Button>
            <Text>{errorMessage}</Text>
        </Grid>
    )
}
