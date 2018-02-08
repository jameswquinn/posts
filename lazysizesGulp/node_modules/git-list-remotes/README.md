# git-list-remotes
List the remotes of a git repository

[![Build Status](https://travis-ci.org/marco-c/git-list-remotes.svg?branch=master)](https://travis-ci.org/marco-c/git-list-remotes)
[![dependencies](https://david-dm.org/marco-c/git-list-remotes.svg)](https://david-dm.org/marco-c/git-list-remotes)
[![devdependencies](https://david-dm.org/marco-c/git-list-remotes/dev-status.svg)](https://david-dm.org/marco-c/git-list-remotes#info=devDependencies)


# API

The function exported by the module accepts one parameter:
- `directory`: the directory of the git repository.

It returns a promise that resolves to an array containing the names of the remotes of the git repository.


# Example

```JavaScript
var gitListRemotes = require('git-list-remotes');

gitListRemotes('.').then(function(remotes) {
  console.log('Found ' + remotes.length + ' remotes');
  console.log('The remotes are: ' + remotes.join(', '));
});
```
