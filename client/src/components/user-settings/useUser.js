import React, { useState, useEffect } from "react";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";


export default function useUser() {
    const { backend } = useBackendContext();
    const { currentUser } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState("");
    const [userInfo, setUserInfo] = useState();
    useEffect(() => {
        (async () => {
            try {
                const { data } = await backend.get(`/users/${currentUser.uid}`);
                setUserInfo(data[0]);
            }
            catch (e) {
                setErrorMessage(e.message);
            }
        })();
    }, []);
    console.log(userInfo);
    /**
     * useEffect(function, dependencyArray)
     * useEffect(() => {
     * }, [])    [] means no dependencies which means useEffect only runs the first time you render/mount
     * If you do have dependencies, it would run the effect every time the dependency changes
     */

    const updateUser = async () => {
        try {
            await backend.put(`/users/${currentUser.uid}`,
                {firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email});
            alert("Changes saved successfully.");
        }
        catch (e){
            setErrorMessage(e.message);
        }
    }

    const updateQuota = async (newQuota) => {
        await backend.put(
            "users/update/set-calc-factor",
            { factor: newQuota, firebaseUid: userInfo.firebaseUid }
        );
    }

    // returning object with three props
    return {
        userInfo,
        setUserInfo,
        errorMessage,
        updateUser,
        updateQuota
    };

}
