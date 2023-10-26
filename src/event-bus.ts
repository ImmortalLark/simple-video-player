type EventCallback = (payload?: any) => any;

class EventBus {
  store: Record<string, EventCallback[]> = {};


  on(eventName: string, fn: EventCallback) {
    if (!fn || !(fn instanceof Function)) return;
    if (!this.store[eventName]) {
      this.store[eventName] = [];
    }
    this.store[eventName].push(fn);
  }

  emit(eventName: string, payload?: any) {
    const fnList = this.store[eventName];
    return fnList?.map((fn) => {
      return fn(payload);
    });
  }

  remove(eventName: string, fn?: EventCallback) {
    if (!this.store[eventName]) return;
    if (!fn) {
      delete this.store[eventName];
      return;
    }
    this.store[eventName] = this.store[eventName].filter((cb) => cb !== fn);
  }
}

const eventBus = new EventBus();
export default eventBus;