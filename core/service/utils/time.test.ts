import Time from './time';

test('Returns current time.', () => {
    let time = new Time();
    let now = time.now();
    let past = new Date(2020, 1, 1);
    expect(now.getTime()).toBeGreaterThan(past.getTime());
})

test('Overwrite now.', () => {
    let override = new Date(2020, 1, 1);
    let time = new Time();
    time.nowOverride = override;
    expect(time.now()).toEqual(override);
})
