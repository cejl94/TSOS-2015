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

            //Run
            sc = new ShellCommand(this.shellRun,
                "run",
                "<number>- Executes the program with the given pid");
            this.commandList[this.commandList.length] = sc;

            //Runall
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- Executes all loaded user programs");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellPS,
                "ps",
                "- list the running processes and their IDs");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill,
                "kill",
                "<number>- Kills the program with the given pid");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- restores memory to its default setting");
            this.commandList[this.commandList.length] = sc;

            // quantum <number>
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "<number>- Sets the quantum to the number input");
            this.commandList[this.commandList.length] = sc;

            // create <filename>
            sc = new ShellCommand(this.shellCreateFile,
                "create",
                "<filename>- Creates a file with the entered name");
            this.commandList[this.commandList.length] = sc;

            //read <filename>
            sc = new ShellCommand(this.shellReadFile,
                "read",
                "<filename>- Reads a file with the entered name");
            this.commandList[this.commandList.length] = sc;

            //write <filename> <string>
            sc = new ShellCommand(this.shellWriteFile,
                "write",
                "<filename> \"data\"- Writes the string to a file with the entered name");
            this.commandList[this.commandList.length] = sc;

            //delete <filename>
            sc = new ShellCommand(this.shellDeleteFile,
                "delete",
                "<filename>- Deletes a file with the entered name");
            this.commandList[this.commandList.length] = sc;

            //format
            sc = new ShellCommand(this.shellFormat,
                "format",
                "- Resets file system and disk");
            this.commandList[this.commandList.length] = sc;

            //ls
            sc = new ShellCommand(this.shellLS,
                "ls",
                "- Lists all files");
            this.commandList[this.commandList.length] = sc;

            //setschedule <algorithm>
            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                "<algorithm> - Sets the cpu scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;

            //getschedule
            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                "- Gets the cpu scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;

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
                    case"run":
                        _StdOut.putText("Run executes a user program with the sepcified pid.");
                    case"runall":
                        _StdOut.putText("Runall executes all loaded user programs.");
                    case"clearmem":
                        _StdOut.putText("Clearmem clears the memory entirely.");
                    case"quantum":
                        _StdOut.putText("Quantum sets the quantum to the number entered.");
                    case"ps":
                        _StdOut.putText("Ps displays all process ids currently running.");
                    case"kill":
                        _StdOut.putText("Kill terminates the program withe the pid entered");
                    case"create":
                        _StdOut.putText("Create creates a file with the specified name.");
                    case"read":
                        _StdOut.putText("Read reads a file with the specified name.");
                    case"write":
                        _StdOut.putText("Write writes a string to a file with the specified name.");
                    case"delete":
                        _StdOut.putText("Delete deletes a file with the specified name.");
                    case"format":
                        _StdOut.putText("Format resets the file system/disk.");
                    case"ls":
                        _StdOut.putText("Lists all files.");
                    case"setschedule":
                        _StdOut.putText("Sets the CPU scheduling algorithm.");
                    case"getschedule":
                        _StdOut.putText("Gets the CPU scheduling algorithm.");



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
        public shellLoad(args) {

            if (args[0] < 0) {
                _StdOut.putText("Priority cannot be negative");
            }
            else {

            _Kernel.krnTrace("Priority is " + args[0]);
            var userInput = <HTMLInputElement> document.getElementById("taProgramInput");
            var toArray = userInput.value;
            var counter = 0;
            _Kernel.krnTrace("the input value is " + userInput.value + ".");
            for (var i = 0; i < toArray.length; i++) {

                if (userInput.value.length == 0) {
                    _StdOut.putText("Please enter hex digits, buddy");

                }

                if (toArray.charAt(i).match(/[0-9A-Fa-f\s]/g) != null) {

                    counter++;
                }

            }
            if (counter == toArray.length) {

                var instructions = toArray.replace(/[\s]/g, "");

                if (args[0] != undefined) {
                    memManager.loadInputToMemory(instructions, args[0]);
                }
                else {
                    memManager.loadInputToMemory(instructions, 100);

                }


            }
            else {
                _StdOut.putText("You have entered an incorrect digit.");

            }
        }

            // take the input and get rid of spacing





        }

        public shellBSOD(args){

            _StdOut.putText("The operating system is crashing uber hard right now.");
            _StdOut.putText(_Kernel.krnTrapError("An error has been found. Your Operating System will self destruct now."));


        }

        public shellRun(args){

            var execute = false;


            for(var i = 0; i < residentList.length; i++){
                //loop through resident list and get each elements pid;
                var check = residentList[i].pid;
                //if the pid is equal to what was input, set currently executing to that PCB
                if(check == args){
                   // _StdOut.putText("Executing PID " + args);
                    if(residentList[args].location == "disk"){
                        var fileName = "process" + args.toString();
                        cpuScheduler.runSingleFromDisk(fileName, args);
                        execute = true;
                        memManager.clearSegment(residentList[pid].base, residentList[pid].limit);


                    }
                    else {
                        currentlyExecuting = residentList[i];
                        _CPU.updateCPU(currentlyExecuting);
                        _CPU.isExecuting = true;
                        execute = true;
                    }

                }
                else{
                    //_StdOut.putText("PID  " + args + " does not exist.");

                }
            }

            if(execute){
                _StdOut.putText("Executing PID " + args);
            }
            else{
                _StdOut.putText("PID  " + args + " does not exist.");

            }

        }

        public shellRunAll(args){

            //if priority is the scheduling algorithm, sort the resident list.
            if(premPriority) {

                residentList = cpuScheduler.orderResidentList(residentList);
                for(var i = 0; i < residentList.length; i++){
                    _Kernel.krnTrace("PRIORITY RESIDENT LIST FIRST ELEMENT IS " + residentList[i].priority);

                }
            }
            //while the resident list contains things, enqueue all of them into the ready Queue
            _StdOut.putText("length of the list is " + residentList.length);
            var counter = 0;
            for(var i = 0; i < residentList.length; i++){
                _StdOut.putText("RLC " + residentList[counter].pid);
                readyQueue.enqueue(residentList[counter]);
                _Kernel.krnTrace("SIZE OF Q IS " + residentList.length);
                _Kernel.krnTrace("FIRST PID IS  " + readyQueue.index(0).pid.toString());
                //_Kernel.krnTrace("ready queue at " + counter + " is " + readyQueue.dequeue().pid);
                counter++;

            }
            cpuScheduler.startExecution();


        }

        public shellClearMem(args){

            memManager.clearMemory();
            _StdOut.putText("Memory has been cleared");
            // also gotta clear resident list and ready queue
        }

        public shellQuantum(args){

            if(args < 0){
                _StdOut.putText("Quantum cannot be negative");
            }
            else {
                quantum = args;
                _StdOut.putText("Quantum has been set to " + args);
            }

        }

        public shellPS(args){
            //first print out the curerntly executing pid
            //loop through ready queue and std out the PIDs

            _StdOut.putText("Process pids are " + currentlyExecuting.pid);
            for(var i = 0; i < readyQueue.getSize(); i++){
               // _StdOut.putText("Hello");
                _StdOut.putText(" " +readyQueue.index(i).pid);
            }

        }

        public shellKill(args){
            //kill a process with the entered pid,


            var pidFound = false;


            //if the pid you want to kill is currently executing, set currently executing to
            //the next element in the queue and update the CPU.

            if(currentlyExecuting.pid == args) {

                // check if what you are killing in the only existing process
                if (readyQueue.getSize() == 0) {

                    _StdOut.putText("PID " + args + " killed");
                    _CPU.isExecuting = false;
                    memManager.clearSegment(currentlyExecuting.base, currentlyExecuting.limit);

                }
                else{

                    _StdOut.putText("PID " + args + " killed.");
                    memManager.clearSegment(currentlyExecuting.base, currentlyExecuting.limit);
                    currentlyExecuting = readyQueue.dequeue();
                    _CPU.updateCPU(currentlyExecuting);
                }




            }

            // else the PID should be in the ready queue, so then lets search that
            else{

                for(var i = 0; i < readyQueue.getSize(); i++){

                    //if the pid matches, remove that process from the ready queue
                    if(readyQueue.index(i).pid == args){

                        //if only one process exists in the ready queue, just remove it.
                        if(readyQueue.getSize() == 1){

                            var kill = readyQueue.dequeue();


                        }

                        else{

                            // remove the two (ready queue can have a maximum of 3 elements) from the queue and check
                            // their pids, then after you know which is the culprit, put the other one back
                            var kill = readyQueue.dequeue();
                            var keep = readyQueue.dequeue();

                            if(kill.pid == args){
                                memManager.clearSegment(kill.base, kill.limit);
                                readyQueue.enqueue(keep);
                                var pidFound = true;

                            }
                            else{
                                memManager.clearSegment(keep.base, keep.limit);
                                readyQueue.enqueue(kill);
                                var pidFound = true;
                            }
                        }


                    }
                }
            }

            if(pidFound){

                _StdOut.putText("PID " + args + " killed. ");
            }


        }

        public shellCreateFile(args){

            //create a file with the name that was entered. makes use of
            //the methods in fileSystemDeviceDriver

            if(args.length > 0 && args.length <=60){



               // _Kernel.krnTrace("This is being run");
                fileSystemDeviceDriver.createFile(args.join());
                _StdOut.putText("File " + args.join()+ " was created successfully");

                Control.updateFileSystemTable();

            }
            else{
                _StdOut.putText("File name either nonexistent or too long.");

            }
        }
        public shellReadFile(args){

            //create a file with the name that was entered. makes use of
            //the methods in fileSystemDeviceDriver

            if(args.length > 0){


                _Kernel.krnTrace("Read File is being run");
                fileSystemDeviceDriver.readFile(args.join());
                //_StdOut.putText("File " + args.join()+ " was read successfully");
                Control.updateFileSystemTable();

            }
        }
        public shellWriteFile(args){

            //create a file with the name that was entered. makes use of
            //the methods in fileSystemDeviceDriver

            if(args.length >= 2){


                _Kernel.krnTrace("Write file is being run");

               // _Kernel.krnTrace("ARGS ARE " + args[0] + " " + args[1]);

                //for the second arguement, add all its characters into a string

                var fileData = "";
                for(var i = 1; i < args.length; i++){
                    fileData+= args[i] + " ";


                }
                //_Kernel.krnTrace(" input is" + fileData);

                //subtract 2 from length because of the extra space added above
                if(fileData.charAt(0) == "\"" && fileData.charAt(fileData.length - 2) == "\"" ){


                    fileSystemDeviceDriver.writeFile(args[0], fileData.slice(1, fileData.length -2));
                    _StdOut.putText("File " + args[0] + " was written successfully");
                }
                else{
                    _StdOut.putText("Error, data was not in quotes");
                }


                Control.updateFileSystemTable();

            }

        }
        public shellDeleteFile(args){

            //create a file with the name that was entered. makes use of
            //the methods in fileSystemDeviceDriver

            if(args.length > 0){


                _Kernel.krnTrace("Delete file is being run");

                fileSystemDeviceDriver.deleteFile(args.join());


                _StdOut.putText("File " + args.join()+ " was deleted successfully");
                Control.updateFileSystemTable();

            }
        }
        public shellFormat(args){

            //create a file with the name that was entered. makes use of
            //the methods in fileSystemDeviceDriver




                _StdOut.putText("Hard Drive Formatted.")
                fileSystemDeviceDriver.format();
                Control.updateFileSystemTable();


        }

        public shellLS(args){

            //_StdOut.putText("Files:");
            //_StdOut.advanceLine();
            fileSystemDeviceDriver.ls();


        }

        public shellSetSchedule(args){


            if (args.length >0){

                if(args == "rr"){
                    roundRobin= true;
                    fcfs=false;
                    premPriority=false;
                    _StdOut.putText("Scheduling algorithm set to round robin.");
                }
                if(args =="fcfs"){


                    fcfs=true;
                    roundRobin= false;
                    premPriority=false;
                    _StdOut.putText("Scheduling algorithm set to first come first serve.");

                }
                if(args == "priority"){
                    premPriority = true;
                    roundRobin = false;
                    fcfs = false;
                    _StdOut.putText("Scheduling algorithm set to non-preemptive priority.");

                }

            }
        }

        public shellGetSchedule(args){





                if(roundRobin){

                    _StdOut.putText("Current scheduling algorithm is round robin.");
                }
                if(fcfs){

                    _StdOut.putText("Current scheduling algorithm is first come first serve.");

                }
                if(premPriority){

                    _StdOut.putText("Current scheduling algorithm is non-preemptive priority.");

                }

        }

    }
}
