# simple commandline
[![NPM Version](http://img.shields.io/npm/v/simplecommandline.svg?style=flat)](https://www.npmjs.org/package/simplecommandline)

Create your own command line program easily by simply create an function

#### Install
`npm install -g simplecommandline`

#### Create an new command
Custom folder will be saved in 'helpers/simplecommandline' in your current directory
`scl command:create myepic TestCommand TestCommand --desc="my awesome command" --shortcut="c:tc" --usage="<argSuccess> (--argSuccess='1')" --example="myepic:TestCommand 0"`

#### Remove an command
`scl command:remove myepic TestCommand`

#### Test
`scl myepic:TestCommand 0`
`scl myepic:TestCommand 1`

#### Customize
When you want to change the logo of your simple commandline program simply add an new 'logo.ascii' file in 'helpers/simplecommandline' 

#### Help
Keep in mind that when you are passing an argument with spaces pass the argument with --argName="argValue"

`scl help`