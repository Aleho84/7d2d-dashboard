const net = require('net');
const { telnet } = require('../config');

// La lista blanca de comandos permitidos para mayor seguridad.
const ALLOWED_COMMANDS = ['listplayers', 'lp', 'version', 'gg', 'say'];

// Definimos los prompts que el servidor de 7D2D usa para comunicarnos.
const PROMPT_PASSWORD = 'Please enter password:';
const PROMPT_READY = `Press 'help' to get a list of all commands. Press 'exit' to end session.`;
const PROMPT_COMMAND_EXECUTED = 'INF Executing command';
const PROMPT_COMMAND_EXECUTED_END = ['Total of', 'TFP_MarkersExample', 'GamePref.ZombiePlayers', 'Wrong number of arguments', 'INF Chat'];

function executeTelnetCommand(command) {
    return new Promise((resolve, reject) => {
        const [cmd] = command.split(' ');
        if (!ALLOWED_COMMANDS.includes(cmd.toLowerCase())) {
            return reject(new Error(`Comando no permitido: ${cmd}`))
        }

        const client = new net.Socket();
        let buffer = '';
        let state = 'CONNECTING'; // Estado inicial de nuestra máquina de estados.
        let commandResponse = '';
        let resolved = false; // Flag para asegurar que la promesa se resuelva/rechace una sola vez

        // Implementamos un timeout para evitar que la conexión se quede colgada.
        const connectionTimeout = setTimeout(() => {
            if (!resolved) {
                client.destroy(); // Cierra el socket forzosamente.
                reject(new Error('Timeout: La conexión al servidor Telnet tardó demasiado.'));
                resolved = true;
            }
        }, 10000); // 10 segundos de espera.

        client.connect(telnet.port, telnet.host || '127.0.0.1', () => {
            console.log('Conectado al servidor Telnet.');
            state = 'AUTHENTICATING';
        });

        client.on('data', (data) => {
            buffer += data.toString();

            // Procesamos el buffer línea por línea para manejar los datos de forma segura.
            let endOfLineIndex;
            while ((endOfLineIndex = buffer.indexOf('\n')) > -1) {
                const line = buffer.substring(0, endOfLineIndex).trim();
                buffer = buffer.substring(endOfLineIndex + 1);
                console.log(state);

                if (state === 'AUTHENTICATING' && line.includes(PROMPT_PASSWORD)) {
                    client.write(`${telnet.password}\n`);
                    state = 'READY';
                } else if (state === 'READY' && line.includes(PROMPT_READY)) {
                    client.write(`${command}\n`);
                    state = 'EXECUTING';
                } else if (state === 'EXECUTING') {
                    if (line.includes(PROMPT_COMMAND_EXECUTED)) {
                        // Ignoramos la línea que confirma la ejecución para obtener solo la respuesta.
                        continue;
                    } else {
                        if (PROMPT_COMMAND_EXECUTED_END.some(item => line.includes(item))) {
                            // Aquí terminamos de recibir la respuesta del comando.
                            commandResponse += line + '\n'; // Acumulamos la ultima respuesta del comando.
                            if (!resolved) {
                                clearTimeout(connectionTimeout); // Limpiamos el timeout ya que hemos recibido la respuesta.
                                resolve(commandResponse.trim());
                                resolved = true;
                                client.end(); // Cerramos la conexión de forma limpia.
                            }
                        } else {
                            commandResponse += line + '\n'; // Acumulamos la respuesta del comando.
                        }
                    }
                }
            }
        });

        client.on('close', () => {
            if (!resolved) {
                clearTimeout(connectionTimeout); // Limpiamos el timeout si la conexión se cierra bien.
                resolve(commandResponse.trim());
                resolved = true;
            }
            console.log('Conexión Telnet cerrada.');
        });

        client.on('error', (err) => {
            if (!resolved) {
                clearTimeout(connectionTimeout);
                console.error('Error de Telnet:', err);
                reject(err);
                resolved = true;
            }
        });
    });
}

module.exports = { executeTelnetCommand };