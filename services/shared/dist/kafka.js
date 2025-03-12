import { Kafka } from 'kafkajs';
import { logger } from './logger.js';
export const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
    logLevel: +(process.env.KAFKA_LOG_LEVEL || '4'),
    requestTimeout: +(process.env.KAFKA_REQUEST_TIMEOUT || '60000'),
    connectionTimeout: +(process.env.KAFKA_CONNECTION_TIMEOUT || '60000'),
    retry: {
        initialRetryTime: 250,
        maxRetryTime: 60000,
    }
});
export async function intializeTopics() {
    const topics = process.env.KAFKA_TOPICS?.split(',');
    if (!topics || topics.length < 1) {
        return;
    }
    const admin = kafka.admin();
    try {
        await admin.connect();
        for (const iterator of topics) {
            try {
                const [topic, numPartitions] = iterator.split(':');
                await admin.createTopics({
                    topics: [
                        {
                            topic: topic,
                            numPartitions: +(numPartitions || 1),
                        }
                    ],
                });
            }
            catch (e) {
                logger.error(e, `Failed to crete topic for '${iterator}'`);
            }
        }
        logger.debug('Succed to create kafka topics');
    }
    catch (e) {
        logger.error(e, 'Failed to create kafka topics');
    }
    finally {
        await admin.disconnect();
    }
}
