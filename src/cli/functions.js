const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const downloadGitRepo = require('download-git-repo');
const {replacePlaceholder} = require('../utils/utils');


let gitProjectUrl = 'http://git.octopusmanagement.it:7990/scm/lpd/landing-page-starter.git';

exports.create = function (prjPath, options = {}) {
    /*Options => branch [default = master] , landingName [default = 'folder name']*/
    console.log(chalk.cyan(`⚠  Project will be installed in:\n\t${prjPath}`));

    if(options.hasOwnProperty('branch'))
        gitProjectUrl = `${gitProjectUrl}#${options.branch}`;

    if(!options.hasOwnProperty('landingName')){
        const pathSplited = prjPath.split('\\');
        options.landingName = pathSplited[pathSplited.length-1];
    }

    downloadGitRepo(`direct:${gitProjectUrl}`, prjPath, {clone: true}, function (err){
        if(err) {
            console.log(chalk.red(err));
            process.exit(1);
        }

        const templatePaths = {
            indexHTML: path.resolve(process.cwd(), `${prjPath}/public/index.html`),
            packageJSON: path.resolve(process.cwd(), `${prjPath}/package.json`)
        };

        const templateData = {
            indexHTML: {
                landingName: options.landingName.replace(/-|_/g, ' ') || ''
            },
            packageJSON: {
                landingName: `${options.landingName}-` || ''
            }
        };

        for(let fileKey in templatePaths){
            fillTemplate(templatePaths[fileKey], templateData[fileKey]);
        }

        console.log(chalk.green('\n✔ Landing page starter project created!'));

    });

};


function fillTemplate(templatePath, values){

    let template = '';

    fs.readFile(templatePath, 'utf-8', (err, data) => {
        if(err) console.log(chalk.redBright(err));

        template = data;
        for(let placeholder in values){
            template = replacePlaceholder(template, placeholder, values[placeholder]);
        }

        fs.writeFile(templatePath, template, (err) => {
            if(err) console.log(chalk.redBright(err));
        });
    });
}