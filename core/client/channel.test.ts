import { createChannel } from "./channel";

test("channel happy path",  () => {
    const [s, r] = createChannel<number>();
    const msg = 42;
    s.send(msg);
    expect(r.lastMsg()).toBe(msg);
});

test("channel callback", done => {
    const [s, r] = createChannel<number>();
    const msg = 42;

    r.on(m =>{
        try{
            expect(m).toBe(msg);
            done();
        }catch (error) {
            done(error);
        }
    });

    s.send(msg);
})

test("channel callback turn off", done => {
    const [s, r] = createChannel<number>();
    const msg = 42;
    const callback = () => {
        done("Unexpected callback");
    } 

    r.on(callback);
    r.off(callback);

    s.send(msg);
    done();
})