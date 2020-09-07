import { Topic, Broker } from "./broker";

test("Topic happy path",  () => {
    const topic = new Topic<number>();
    const msg = 42;
    topic.publish(msg);
    expect(topic.lastMsg).toBe(msg);
});

test("Topic subscribe", done => {
    const topic = new Topic<number>();
    const msg = 42;

    topic.subscribe(m =>{
        try{
            expect(m).toBe(msg);
            done();
        }catch (error) {
            done(error);
        }
    });

    topic.publish(msg);
})

test("Topic unsubscribe", done => {
    const topic = new Topic<number>();
    const msg = 42;
    const callback = () => {
        done("Unexpected callback");
    } 

    topic.subscribe(callback);
    topic.unsubscribe(callback);

    topic.publish(msg);
    done();
})

test("Broker create Topic", () => {
    const broker = new Broker();
    const topic = broker.createTopic("test");
    expect(broker.topic("test")).toBe(topic);
})

test("Broker can't create topic twice", () => {
    const broker = new Broker();
    broker.createTopic<number>("test");
    expect(() => {
        broker.createTopic<number>("test");
    }).toThrow(Error);
})