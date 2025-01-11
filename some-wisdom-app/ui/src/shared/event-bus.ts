type Subscriber = (data?: any) => void;
type Event = { type: string; data?: any };

interface EventSubscriber {
  event: string;
  subscriber: Subscriber
}

export class EventBus {
  subscribers = new Map<string, Subscriber[]>();

  subscribe(event: string, subscriber: Subscriber): EventSubscriber {
    console.log("New subscriber to event: ", event);
    let eventSubscribers = this.subscribers.get(event);
    if (!eventSubscribers) {
      eventSubscribers = [];
      this.subscribers.set(event, eventSubscribers);
    }

    eventSubscribers.push(subscriber);

    return { event, subscriber };
  }

  publish(event: Event): void {
    const eventSubscribers = this.subscribers.get(event.type);
    if (eventSubscribers) {
      eventSubscribers.forEach(s => s(event.data));
    }
  }

  unsubscribe(subscriber: EventSubscriber) {
    const eventSubscribers = this.subscribers.get(subscriber.event);
    if (eventSubscribers) {
      const updatedEventSubscribers = eventSubscribers.filter(s => s != subscriber.subscriber);
      this.subscribers.set(subscriber.event, updatedEventSubscribers);
    }
  }

  clearAll(): void {
    this.subscribers.clear();
  }
}

export const eventBus = new EventBus();
