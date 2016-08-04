// Loading the Kernel
const FlatOS = require('./system/kernel/Kernel');

// Initialize the OS...
var BootLoader = FlatOS.load('BootLoader');
BootLoader.boot();
