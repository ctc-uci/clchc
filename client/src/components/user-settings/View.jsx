import React from "react";
import { PERSONAL_INFO, CALCULATION_FACTOR, DELETE_ACCOUNT } from "./Settings";
import PersonalInfo from "./PersonalInfo.jsx";
import DeleteAccount from "./DeleteAccount.jsx";
import QuotaCalcFactor from "./QuotaCalcFactor.jsx";

export default function View({currentView}) {
    if(currentView === PERSONAL_INFO) {
        return <PersonalInfo/>;
    }
    else if(currentView === CALCULATION_FACTOR) {
        return <QuotaCalcFactor/>;
    }
    else if(currentView === DELETE_ACCOUNT) {
        return <DeleteAccount/>;
    }
}