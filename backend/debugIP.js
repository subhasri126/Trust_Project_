const os = require('os');
const networkInterfaces = os.networkInterfaces();

console.log('--- Network Interfaces Debug ---');
for (const k in networkInterfaces) {
    console.log(`Interface: ${k}`);
    for (const address of networkInterfaces[k]) {
        console.log(`  Family: ${address.family}, Address: ${address.address}, Internal: ${address.internal}`);
    }
}
