/* eslint-disable @typescript-eslint/no-explicit-any */
type EventCallback = () => void;

export class EventEmitter<Events> {
  private events: Partial<Record<keyof Events, EventCallback[]>> = {};

  on<K extends keyof Events>(event: K, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event]!.push(callback);
  }

  off<K extends keyof Events>(event: K, callback: EventCallback) {
    if (!this.events[event]) {
      return;
    }

    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit<K extends keyof Events>(event: K) {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((cb) => cb());
  }
}

type WFHEvents = {
  wfhEventChange: void;
};

export const WFHEventEmitter = new EventEmitter<WFHEvents>();
