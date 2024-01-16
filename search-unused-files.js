const fs = require('fs');
const path = require('path');

const projectDirectory = process.argv.find(arg => arg.includes('project-directory-')).replace('--project-directory-', '');; 
const extension = '.' + process.argv.find(arg => arg.includes('extension-')).replace('--extension-', '');
const excludedDirectoriesFileNameSearch = process.argv.find(arg => arg.includes('edfns-')).replace('--edfns-', '').split(',');
const excludedDirectoriesFileContentSearch = process.argv.find(arg => arg.includes('edfcs-')).replace('--edfcs-', '').split(',');

console.log('extension: '+extension);

let files = [];
let unusedFilesFound = [];

function isDirectoryExcluded(directory, excludedDirs) {
    const relativePath = path.relative(projectDirectory, directory);
    return excludedDirs.some(excludedDir => relativePath.startsWith(excludedDir));
}

function findFiles(directory) {
    if (isDirectoryExcluded(directory, excludedDirectoriesFileNameSearch)) {
        return;
    }

    fs.readdirSync(directory).forEach(file => {
        const absolutePath = path.join(directory, file);
        if (fs.statSync(absolutePath).isDirectory()) {
            findFiles(absolutePath);
        } else if (path.extname(file) === extension) {
            files.push(absolutePath);
        }
    });
}

function searchSvgInFiles(directory, fileName) {
    if (isDirectoryExcluded(directory, excludedDirectoriesFileContentSearch)) {
        return false;
    }

    let found = false;
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (found) break;

        const absolutePath = path.join(directory, file);
        if (fs.statSync(absolutePath).isDirectory()) {
            found = searchSvgInFiles(absolutePath, fileName);
        } else if (path.extname(file) !== extension) {
            try {
                const content = fs.readFileSync(absolutePath, 'utf8');
                if (content.includes(fileName)) {
                    found = true;
                } else {
                    found = false;
                }
            } catch (err) {
                console.error(`Error reading file ${absolutePath}: ${err}`);
            }
        }
    }

    return found;
}

function checkExtensionFileUsage() {
    findFiles(projectDirectory);

    files.forEach(svgFile => {
        const fileName = path.basename(svgFile);
        let isUsed = false;
        ['./apps', './libs/core/src', './libs/wind/src'].forEach(url => {
            if (searchSvgInFiles(path.join(projectDirectory, url), fileName)) {
                isUsed = true;
            }
        });
        if (!isUsed) {
            unusedFilesFound.push(fileName);
        }
    });
}

checkExtensionFileUsage();
console.log(extension+' files not used');
console.log(unusedFilesFound);
