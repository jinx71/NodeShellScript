/*

Importing Necessary Modules

*/
const readline = require('readline');
const process = require('node:process');
const homedir = require('os').homedir();
const { exec } = require("child_process");
const child_process = require('child_process');
/*

log variable declared for console.log function

*/
let log = console.log;
/*

home directory setup as root as per requirement

*/
process.chdir(homedir)

/*

Exec Function to printou current root directory at the begining

*/

exec('pwd', (error, stdout, stderr) => {
    if (error) {
        log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        log(`stderr: ${stderr}`);
        return;
    }
    log(stdout);
});

/*

User input output interface from the shell

*/

var readShellInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*

Main Shell Function.
Workflow is as below : 

1. Check exit command
2. Check the windows platform for interrupt signal on CTRL+C press
3. Check change directory command
4. Check node application command
5. Exec function to implement other bash inputs like ps, fg, bg, ctrl+z, ls and even node --version
*/
function shell() {
    readShellInput.question(`cmd>`, input => {
        // log('You entered: ', input);
        if (input === 'exit()') {
            return readShellInput.close();
        }

        if (process.platform === "win32") {
            readShellInput.on("SIGINT", function () {
                process.emit("SIGINT");
            });
        }

        if (input.startsWith('cd ')) {
            const dir = input.split(' ')[1];
            process.chdir(dir)
            log(`stdout: ${dir} `);
        }
        if (input.startsWith('node')) {

            var workerProcess = child_process.spawn(input.split(' ')[0], [input.split(' ')[1]]);
            workerProcess.on('close', function (code) {
                // console.log('child process exited with code ' + code);
            });

        }

        exec(input, (error, stdout, stderr) => {
            if (error) {
                if (!error.message.startsWith("Command failed: cd")) {
                    log(`error: ${error.message} `);
                    return;
                }

            }
            if (stderr && !stderr.startsWith("/bin/sh: 1: cd: can't cd to")) {
                log(`stderr: ${stderr} `);
                return;
            }
            log(`stdout: ${stdout} `);

        });
        shell();
        process.on("SIGINT", function () {
            //graceful shutdown
            process.exit();
        });

    });
}
shell()

/*

End of program

*/