import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const redisUrl = process.env.REDIS_URL;
const publisher = createClient({ url: redisUrl });
const subscriber = createClient({ url: redisUrl });

(async () => {
    await subscriber.connect();
    await publisher.connect();
})();

async function main() {
    while (true) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        );
        // @ts-ignore;
        const id = res.element;
        console.log(`Processing build for ID: ${id}`);

        await downloadS3Folder(`output/${id}`);
        console.log(`Downloaded S3 folder for ID: ${id}`);

        await buildProject(id);
        console.log(`Build completed for ID: ${id}`);

        await copyFinalDist(id);
        console.log(`Copied final dist for ID: ${id}`);

        await publisher.hSet("status", id, "deployed");
        console.log(`Set status to deployed for ID: ${id}`);
    }
}

main();
