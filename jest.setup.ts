import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

class MockBroadcastChannel {
  name: string;
  listeners: { [eventType: string]: Array<(event: MessageEvent) => void> };

  constructor(name: string) {
    this.name = name;
    this.listeners = {};
  }

  postMessage(message: unknown) {
    const event = new MessageEvent('message', { data: message });
    this.listeners['message']?.forEach((callback) => callback(event));
  }

  addEventListener(eventType: string, callback: (event: MessageEvent) => void) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  removeEventListener(
    eventType: string,
    callback: (event: MessageEvent) => void
  ) {
    this.listeners[eventType] = this.listeners[eventType]?.filter(
      (listener) => listener !== callback
    );
  }

  close() {
    this.listeners = {};
  }
}

Object.defineProperty(global, 'BroadcastChannel', {
  value: MockBroadcastChannel,
});

Object.assign(global, { TextDecoder, TextEncoder });
