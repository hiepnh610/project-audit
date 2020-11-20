const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const rootFolder = path.parse(process.cwd()).dir;
const workDir = `${rootFolder}/ops-gui`;

const readFileInDir = (dirName) => {
  fs.readdir(dirName, (error, filenames) => {
    if (error) {
      console.log('error', error);

      return;
    };

    const excludeFile = filenames.filter((file) => {
      return (
        file !== 'node_modules' &&
        file !== '.git' &&
        file !== 'dist' &&
        file !== 'themes' &&
        file !== 'images' &&
        file !== 'package-lock.json' &&
        file !== 'yarn.lock' &&
        path.extname(file) !== '.csv' &&
        path.extname(file) !== '.scss' &&
        path.extname(file) !== '.css' &&
        path.extname(file) !== '.html'
      );
    });

    loopThroughFolder(excludeFile, dirName);
  });
};

const loopThroughFolder = (dirname, filePath) => {
  for (file of dirname) {
    let filePwd = `${filePath}/${file}`;

    fs.lstat(filePwd, (error, fileStatus) => {
      if (error) {
        console.log('error', error);

        return;
      }

      if (!fileStatus.isFile()) {
        const newFilePwd = `${filePwd}`;

        readFileInDir(newFilePwd);

        return;
      }

      fs.readFile(filePwd, 'utf8', (err, data) => {
        if (err) return;

        const linesOfFile = data.split('\n').length;

        if (linesOfFile >= 400) {
          console.log(
            chalk.cyan(filePwd.replace(workDir, '')),
            chalk.red(`${linesOfFile} lines`)
          );

          console.log('-'.repeat(20));
        }
      });
    });
  }
};

readFileInDir(workDir);
