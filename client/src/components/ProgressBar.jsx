import React from "react";
import { Progress } from "@chakra-ui/react";
import styles from "./ProgressBar.module.css";

export default function ProgressBar(props) {
    const {
        width = "10em",
        currentProgress,
        setCurrentProgress
    } = props;
    

    const handleDecrease = () => setCurrentProgress(prev => prev-1);

    const handleIncrease = () => setCurrentProgress(prev => prev+1);

    return(
        <section
            className={styles["progress-bar"]}
        >
            <button
                className={styles.button}
                onClick={handleDecrease}
            >
                {"\u2193"}
            </button>
            <Progress
                value={currentProgress}
                colorScheme="pink"
                width={width}
                
            />
            <button
                className={styles.button}
                onClick={handleIncrease}
            >
                {"\u2191"}
            </button>
        </section>
    )
}