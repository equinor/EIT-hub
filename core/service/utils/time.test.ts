import Time from './time';

test('Returns current time.', () => {
    const time = new Time();
    const now = time.now();
    const past = new Date(2020, 1, 1);
    expect(now.getTime()).toBeGreaterThan(past.getTime());
})

test('Overwrite now.', () => {
    const override = new Date(2020, 1, 1);
    const time = new Time();
    time.nowOverride = override;
    expect(time.now()).toEqual(override);
})
