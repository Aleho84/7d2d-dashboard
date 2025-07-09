const os = require('os');

getServerIP = () => {
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = 'localhost';

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
                break;
            }
        }
        if (ipAddress !== 'localhost') break;
    }

    return ipAddress;
};

module.exports = { getServerIP };