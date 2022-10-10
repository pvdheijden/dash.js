const fs = require('fs');
const path = require('path');


const precommitTemplate = `#!/usr/bin/env node

var exec = require('child_process').exec;

exec('npm run lint', {
       cwd: '${__dirname.toString().replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'
     }, function (err, stdout, stderr) {

  var exitCode = 0;
  if (err) {
    console.log(stderr || err);
    exitCode = -1;
  }

  process.exit(exitCode);
}).stdout.on('data', function (chunk){
    process.stdout.write(chunk);
});
`;


function getPathToHooksFolder() {
  const pathToHooksFolder = path.join(`${__dirname}`, '.git', 'hooks')
  const pathToSuperHooksFolder = path.join(`${__dirname}`, '../.git/modules/dash.js', 'hooks')

  return fs.existsSync(pathToHooksFolder) ? pathToHooksFolder : pathToSuperHooksFolder
}

function writeHook() {
  const precommitFile = path.join(getPathToHooksFolder(), 'pre-commit');
  fs.writeFile(precommitFile, precommitTemplate, { mode: 0o755 }, (err) => {
    if (err) throw err;
    console.log(`${precommitFile} created.`);
  });
}

fs.access(getPathToHooksFolder(), (err) => {
  if (err) {
    fs.mkdir(getPathToHooksFolder(), { recursive: true }, (err) => {
      if (err) throw err;
      writeHook();
    });
  } else {
    writeHook();
  }
});
