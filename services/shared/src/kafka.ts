import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'microservices-app',
  brokers: ['kafka:9092'],
});