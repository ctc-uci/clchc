import cron from 'node-cron';
import { db } from "@/db/db-pgp"; // TODO: replace this db with

let task;
let running = false;

// temp: 2AM every day to keep only a 7-day log
let interval = "0 2 * * *"

const startCron = () => {
    console.log("cron started");
    task = cron.schedule(interval, async () => {
        if (running) return;

        try {
            running = true;
            await db.query(
                // For now, I just set "old" to 1 week
                `DELETE FROM version_log 
                WHERE timestamp > NOW() - INTERVAL '7 days'`
            );
        }
        catch (err) {
            console.log(err);
        }
        finally {
            running = false;
        }

    })
}

const stopCron = () => {
    console.log("cron stopped");
    if (!task) return;

    task.stop();
    task.destroy();
}

export { startCron, stopCron };