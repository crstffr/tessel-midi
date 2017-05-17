import {EventClient} from './eventClient';

export class Event {

    constructor (topic, data) {
        EventClient.send(Event.serialize(topic, data));
    }

    static serialize(topic, data) {
        data = Object.assign({}, data || {}, {topic: topic});
        return JSON.stringify(data);
    }

    static parse(data) {
        try {
            data = JSON.parse(data);
        } catch(e) {}
        return data;
    }

}