import nats, { Stan } from 'node-nats-streaming';

// Singleton class to enable get an instance of our connected nats client through out the application
// models how mongoose handles connection
class NatsWrapper {
  private _client?: Stan;

  // Getter that returns _client after a successful connection
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  // Setup connection to NATS server
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', err => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
