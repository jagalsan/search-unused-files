# 💻 Search unused files
This Node.js script is designed for identifying unused files of a specified extension within a project. Its functionality is outlined as follows:

## 0. Use example
```node search-unused-files.js --extension-svg --edfns-node_modules,coverage,dist --edfcs-node_modules,coverage,dist --project-directory-./```

## 1. Configuration via Command-Line Arguments:

- --project-directory-: Sets the root directory of the project to be scanned.
- --extension-: Sets the file extension to be checked (e.g., .js, .css).
- --edfns-: Specifies directories to exclude from the file name search.
- --edfcs-: Specifies directories to exclude from the file content search.

## 2. File Search Process:

The script searches the project directory for files with the given extension, avoiding the directories listed in --edfns-.
It maintains a list of these files for further examination.

## 3. Unused File Detection:

For each file found, the script checks if its name appears in the content of any files within certain directories (hardcoded as ./apps, ./libs/core/src, and ./libs/wind/src), excluding those in --edfcs-.
If a file's name isn't found in the contents of other files, it's considered unused.

## 4. Results Output:

The script outputs the extension being checked and a list of unused files with that extension.
This helps in identifying files that are potentially redundant and can be removed to declutter the project.
This script is particularly useful in large projects where manually tracking every file's usage can be cumbersome. It automates the process of identifying unused files, aiding in efficient project maintenance and codebase optimization.
