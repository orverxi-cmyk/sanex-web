
type ErrorEvents = {
  'permission-error': (error: any) => void;
};

class ErrorEmitter {
  private listeners: { [K in keyof ErrorEvents]?: ErrorEvents[K][] } = {};

  on<K extends keyof ErrorEvents>(event: K, listener: ErrorEvents[K]) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof ErrorEvents>(event: K, ...args: Parameters<ErrorEvents[K]>) {
    this.listeners[event]?.forEach((listener) => {
      // Use a type cast to satisfy the compiler that the arguments match the listener signature
      (listener as (...args: any[]) => void)(...args);
    });
  }

  off<K extends keyof ErrorEvents>(event: K, listener: ErrorEvents[K]) {
    this.listeners[event] = this.listeners[event]?.filter((l) => l !== listener);
  }
}

export const errorEmitter = new ErrorEmitter();
