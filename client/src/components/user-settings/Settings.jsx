import React, {useState} from "react";

export const PERSONAL_INFO = "personal-info";
export const DELETE_ACCOUNT = "delete-account";
export const QUOTA_CALCULATION = "quota-calculation";

export default function Settings() {
    // State to determine which "tab" being shown in the View.
    const [currentView, setCurrentView] = useState(PERSONAL_INFO);
    
    return(
        null
    )
}