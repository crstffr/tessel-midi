import PubSub from 'pubsub-js';
import {Event} from './event';
import {EventClient} from './eventClient';

class EventStreamClass {

    start() {
        EventClient.on('message', (msg) => {
            msg = Event.parse(msg);
            if (msg.topic) {
                PubSub.publish(msg.topic, msg);
            }
        });
    }

    on(topic, cb) {

        let token;
        let response;

        token = PubSub.subscribe(topic, (...args) => {
            if (typeof cb === 'function') {
                cb(...args);
            }
            if (response) {
                response = (typeof response === 'function') ? response() : response;
                this.send('response:' + topic, {response: response});
            }
        });

        return {
            off: () => {
                this.off(token);
            },
            respondWith: (something) => {
                response = something;
            }
        };

    }

    once(topic, cb) {
        let event = this.on(topic, (...args) => {
            event.off();
            cb(...args);
        });
        return event;
    }

    off(token) {
        if (!token) { return; }
        return PubSub.unsubscribe(token);
    }

    send(topic, something) {
        new Event(topic, something);
    }

}

export let EventStream = new EventStreamClass();
export let Stream = EventStream;