import { createClient } from 'redis';

async function clearQueue() {
    const client = createClient();
    await client.connect();

    // List current queue
    const queue = await client.lRange('build-queue', 0, -1);
    console.log('Current Queue:', queue);

    // Remove specific ID
    await client.lRem('build-queue', 1, 'epwic');
    console.log('Queue after removing "epwic":', await client.lRange('build-queue', 0, -1));

    // Clear entire queue
    await client.del('build-queue');
    console.log('Queue after clearing:', await client.lRange('build-queue', 0, -1));

    await client.quit();
}

clearQueue().catch(console.error);
