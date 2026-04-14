import cron from 'node-cron'

let task;
let running = false;

const startCron = () => {
    console.log("cron started");
    task = cron.schedule("*/5 * * * * *", async () => {
        if (running) return;

        try {
            running = true;
            console.log("printing")
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