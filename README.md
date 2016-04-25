# Git Cutlass

Git Cutlass is a simple curses-like tool to work with git (Work in progress)

# Current features

- Add, reset, checkout files
- Make commits
- View diffs

# Install

```
npm install git-cutlass -g
```

# Run
In a git repository folder
```
gitc
```

# Node version

Git Cutlass requires node `v4.1.0` or more to run.

# Screenshot
![Screenshot](http://erickzanardo.github.io/git-cutlass/gitcutlass.png)

# Changelog

### 1.0.5

- Editiong screen now uses the $EDITOR environment variable to edit files, when not the variable is not present, vim is assumed as default
- Bugfix: Application wouldn't open when the repository had no branches yet, this happend when trying to open gitc with an empty repository.

### 1.0.4

- Adding feature to edit files inside git cutlass using vim
- New screen to see local branch history 
- Bugfixes

### 1.0.3

- Adding feature to view content of new files
- Deletion of new file

### 1.0.2

- Fixed bug when executing git cutlass somewhere else than the root repository

