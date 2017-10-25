# simple commandline
[![NPM Version](http://img.shields.io/npm/v/simplecommandline.svg?style=flat)](https://www.npmjs.org/package/simplecommandline)

Create your own command line program easily by simply create an function

#### Install
`npm install -g simplecommandline`


#### Help
`scl help`


#### Test
`scl scl myepic:command 0`

`scl scl myepic:command 1`


#### Config
Be sure you have an commands.json file in your root directory with the content as discribed in `commands.json.example`
```javascript
{
  "command": {
    "create": {
      "name": "Create command",
      "desc": "Create an new command",
      "shortcut": "c:com",
      "usage": "<commandName> (--commandName='commandName') <commandMethod> (--commandMethod='commandMethod') <name> (--name='name') <desc> (--desc='desc') <shortcut> (--shortcut='shortcut') <usage> (--usage='usage')",
      "example": "command:create test myTest TestCommand --desc=\"my awesome command\" --shortcut='c:myTest' --usage=\"testCommandUsage\" --example=\"My Test command example\""
    },
    "remove": {
      "name": "Remove command method",
      "desc": "Remove an existing command method",
      "shortcut": "c:r",
      "usage": "<commandName> (--commandName='commandName') <commandMethod> (--commandMethod='commandMethod')",
      "example": "Remove given command method"
    }
  },
  "myepic": {
    "command": {
      "name": "my epiccommand",
      "desc": "my awesome command",
      "shortcut": "epic:command",
      "usage": "myepic:command",
      "example": "my awesome command"
    }
  }
}

```