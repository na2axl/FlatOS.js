var FS = require('./system/kernel/Cache');

console.log(FS.createCacheFile({prefix: 'test-', track: false}));