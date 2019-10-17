#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const cliMethods = require('./cli/functions');
const {
    getArgvOptions,
    mapOptions
} = require('./utils/utils');

const cmd = process.argv[2];
const options = getArgvOptions();

switch (cmd) {
    case 'create':
        let projectPath;

        if(!process.argv[3]){
            console.log(chalk.redBright('❌ Project path not defined.\nPlease insert a project name or folder.'));
            process.exit(1);
        }

        projectPath = path.resolve(process.cwd(), process.argv[3]);
        cliMethods.create(projectPath, mapOptions(options));
        break;
    default:
        console.log(chalk.red(`❌ Command "${cmd}" not allowed.`));
        process.exit(1);
        break;
}

