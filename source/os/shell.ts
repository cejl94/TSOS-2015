///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
        	var todaysDate: boolean = false;
        	var atCraigRally: boolean = true;
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;


            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;


            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            
            //date
            sc = new ShellCommand(this.shellDate, 
            						"date",
            						"- Displays the current date and time.");
			this.commandList[this.commandList.length] = sc;
			//whereami
			 sc = new ShellCommand(this.shellWhereAmI, 
            						"whereami",
            						"- Displays Connor's current location.");
			this.commandList[this.commandList.length] = sc;
			
			//secretmessage
				 sc = new ShellCommand(this.shellSecretMessage, 
            						"secretmessage",
            						"- Displays a secret message provided you enter the correct commands first.");
			this.commandList[this.commandList.length] = sc;

            //status
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Displays the <string> in the task bar");
            this.commandList[this.commandList.length] = sc;

            //Load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "- Checks the user program input for hex digits and spaces.");
            this.commandList[this.commandList.length] = sc;

            //BSOD
            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                "- Displays a BSOD Message and shuts down the OS");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                    	_StdOut.putText("Ver displays the version information of the operating system.");
                    	break;
                    case "shutdown":
                    	_StdOut.putText("Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
                    	break;
                     case "cls":
                    	_StdOut.putText("Cls reset the CLI and the position of the cursor.");
                    	break;
                     case "man":
                    	_StdOut.putText("Man displays an explanation for each command. These explanations can be seen all at once via the help command.");
                    	break;
                     case "trace":
                    	_StdOut.putText("Trace disables/enables the trace in the host log.");
                    	break;
                     case "rot13":
                    	_StdOut.putText("Rot13 obscures any string that is entered.");
                    	break;				
                    case "prompt":
                    	_StdOut.putText("Prompt will display any string that is entered in the CLI.");
                    	break;
                    case "date":
                        _StdOut.putText("Date will display today's date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("Whereami will show Connor's current and permanent location.");
                        break;
                    case "secretmessage":
                        _StdOut.putText("Secretmessage displays a message if you can figure it out.");
                        break;
                    case "status":
                        _StdOut.putText("Status will display the user's status in the task bar.");
                        break;
                    case "load":
                        _StdOut.putText("Load checks user program for appropriate characters.");
                        break;
                    case "bsod":
                        _StdOut.putText("Bsod displays a bsod message and shuts down the OS.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        // Displays the date
        //
        public shellDate(args){
        var displayDate = new Date();
        var month = displayDate.getMonth() + 1;
        var hours = displayDate.getHours();
        var minutes = displayDate.getMinutes();
        var year = displayDate.getFullYear();
        var seconds = displayDate.getSeconds();
        var day  = displayDate.getDate();
            if(seconds <=9){
                var str = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":0" + seconds;
                _StdOut.putText(str);
            }
            else {

                var str = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
                _StdOut.putText(str);
            }
        todaysDate = true;

        }
        // Displays my current and permanent location
        public shellWhereAmI(args){
        
        _StdOut.putText("Currently at an anti Daniel Craig rally.");
        atCraigRally = true;
        }
        //I'm a closet Brosnan fan
        public shellSecretMessage(args){
        
        	if (todaysDate && atCraigRally){
        		_StdOut.putText("I'm actually a Pierce Brosnan fan myself");
        		todaysDate = false;
        		atCraigRally = false;
        	}              
        	else{
        	_StdOut.putText("Entering two commands specifically, in any order, will display the secret message.");
        	}
        }
        // posts the status string to the task bar. currently only stays on for 1 second
        //until the time is updated again. this will be fixed (any issues you find on
        // project one were due to lack of time for spending 10 hours on task bar
        // this is because i forgot to actually call the method i made on startup
        // screw me, right?
        public shellStatus(args){
            var htb = <HTMLInputElement> document.getElementById("htbOutput2");

          if(args.length > 0){
               htb.value = args;
          }

        }
        // checks the user program input for hex characters and spaces only
        public shellLoad(args){
            var userInput = <HTMLInputElement> document.getElementById("taProgramInput");
            var toArray = userInput.value;
            var counter = 0;
            for(var i = 0; i < toArray.length; i++){

                if(toArray.charAt(i).match(/[0-9A-Fa-f\s]/g) != null)
                {

                    counter++;
                }

            }
                if(counter == toArray.length){
                    _StdOut.putText("All digits are good.");
                }
                else{
                    _StdOut.putText("You have entered an incorrect digit.");

                }



        }

        public shellBSOD(args){

            _StdOut.putText("The operating system is crashing uber hard right now.");
            _StdOut.putText(_Kernel.krnTrapError("An error has been found. Your Operating System will self destruct now."));


        }

    }
}
