const os = require('os');
const fs = require('fs');
const networkInterfaces = os.networkInterfaces();

let output = '--- Network Interfaces Debug ---\n';
for (const k in networkInterfaces) {
    output += `Interface: ${k}\n`;
    for (const address of networkInterfaces[k]) {
        output += `  Family: ${address.family}, Address: ${address.address}, Internal: ${address.internal}\n`;
    }
}

fs.writeFileSync('debug_ips.log', output);
console.log('Log written to debug_ips.log');
