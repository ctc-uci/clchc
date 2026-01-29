import React, {useState, useEffect} from "react";
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
import useUser from "./useUser";

export default function PersonalInfo(){
    const { userInfo, setUserInfo, errorMessage, updateUser } = useUser();

  
    if(!userInfo){return null};
    /**
     * useEffect(function, dependencyArray)
     * useEffect(() => {
     * }, [])    [] means no dependencies which means useEffect only runs the first time you render/mount
     * If you do have dependencies, it would run the effect every time the dependency changes
     */

    const updateUserProp = (key, value) => {
        setUserInfo(prev => ({...prev, [key]:value}))
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
                        onChange={(e) => updateUserProp("firstName", e.target.value)}
                    />
                </Grid>
            </FormControl>
            <FormControl>
                <Grid>
                    <FormLabel>Last name</FormLabel>
                    <Input
                        value={userInfo.lastName}
                        onChange={(e) => updateUserProp("lastName", e.target.value)}
                    />
                </Grid>
            </FormControl><FormControl>
                <Grid>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        value={userInfo.email}
                        onChange={(e) => updateUserProp("email", e.target.value)}
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
            <Button onClick={updateUser}>Apply changes</Button>
            <Text>{errorMessage}</Text>
        </Grid>
    )
}
