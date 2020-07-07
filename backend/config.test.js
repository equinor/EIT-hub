const config = require('./config');

test('default config have port', () => {
    const d = config.defaultConf;
    expect(d.port).toBeDefined();
})


test('applyEnv empty', () => {
    expect(config.applyEnv({}, {})).toEqual({});
})

test('applyEnv default', () => {
    expect(config.applyEnv({})).toEqual(config.defaultConf);
})

test('applyEnv port', () => {
    const env = {
        EITHUB_PORT: "3000"
    }

    expect(config.applyEnv(env, {})).toEqual({port: 3000});
})