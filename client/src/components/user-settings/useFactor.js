import { useEffect, useState } from "react";

export default function useFactor(userInfo) {
    const [factor, setFactor] = useState(0);

    useEffect(() => {
        if (!userInfo) return;
        setFactor(userInfo.apptCalcFactor ?? 0);
    }, [userInfo]);

    return {
        factor,
        setFactor
    }
}
