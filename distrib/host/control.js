///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    var Control = (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            coreMemoryTable = document.getElementById("coreMemoryTable");
            cpuTable = document.getElementById("cpuTable");
            pcbReadyQueueTable = document.getElementById("pcbReadyQueueTable");
            fileSystemTable = document.getElementById("fileSystemTable");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            this.createMemoryTable();
            this.createFileSystemTable();
            //this.createPcbTable();
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        // This method posts the time to the task bar. Updates will be made to allow for the time and status
        //on the task bar at the same time
        Control.hostTaskBar = function () {
            // Make the date
            var date = new Date();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            // Build the date string
            if (seconds <= 9) {
                var str = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":0" + seconds;
            }
            else {
                var str = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
            }
            var htb = document.getElementById("htbOutput1");
            htb.value = str;
            //update the time every second
            setTimeout(Control.hostTaskBar, 1000);
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();
            memManager = new TSOS.memoryManager(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            mem = new TSOS.memory();
            mem.init();
            fileSystemDD = new TSOS.fileSystemDeviceDriver();
            fileSystemDD.init();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
            //on startup, display the current date and time in the task bar
            Control.hostTaskBar();
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        Control.createMemoryTable = function () {
            //32 rows(768/8) = 96
            //9 columns incleading a header
            for (var x = 0; x < 96; x++) {
                var row = coreMemoryTable.insertRow(x);
                for (var y = 0; y < 9; y++) {
                    var cell = row.insertCell(y);
                    if (y == 0) {
                        var header = (x * 8).toString(16);
                        cell.innerHTML = "0x" + header;
                    }
                    else {
                        cell.innerHTML = "00";
                    }
                }
            }
        };
        Control.updateMemoryTable = function () {
            //this will grab the opCode sitting in memory
            var counter = 0;
            //pretty much the same thing as initialize, just with different values
            for (var x = 0; x < 96; x++) {
                var rows = coreMemoryTable.rows[x];
                for (var y = 0; y < 9; y++) {
                    var cell = rows.cells[y];
                    if (y == 0) {
                        var header = (x * 8).toString(16);
                        cell.innerHTML = "0x" + header;
                    }
                    else {
                        cell.innerHTML = mem.opcodeMemory[counter];
                        counter++;
                    }
                }
            }
        };
        Control.createFileSystemTable = function () {
            for (var x = 0; x < 256; x++) {
                var row = fileSystemTable.insertRow(x);
                for (var columns = 0; columns < 2; columns++) {
                    var cell = row.insertCell(columns);
                    if (columns == 0) {
                        cell.innerHTML = sessionStorage.key(x);
                    }
                    else {
                        cell.innerHTML = sessionStorage.getItem(sessionStorage.key(x));
                    }
                }
            }
        };
        Control.updateFileSystemTable = function () {
            for (var x = 0; x < 256; x++) {
                var row = fileSystemTable.rows[x];
                for (var columns = 0; columns < 2; columns++) {
                    var cell = row.cells[columns];
                    if (columns == 0) {
                        cell.innerHTML = sessionStorage.key(x);
                    }
                    else {
                        cell.innerHTML = sessionStorage.getItem(sessionStorage.key(x));
                    }
                }
            }
        };
        /* public static createPcbTable():void {
 
             //32 rows(768/8) = 96
             //9 columns incleading a header
 
 
             for(var x = 0; x < 4; x++){
                 var row = <HTMLTableRowElement>pcbReadyQueueTable.insertRow(x);
 
                 for(var y = 0; y < 10; y++){
                     var cell = row.insertCell(y);
                     if(x != 0){
 
                         cell.innerHTML = "0";
 
 
                     }
                     else{
                         cell.innerHTML = "0";
                     }
 
                 }
             }
 
 
         }*/
        Control.updateCPUtable = function () {
            var rows = cpuTable.rows[1];
            var cells = rows.cells[0];
            cells.innerHTML = _CPU.PC.toString();
            cells = rows.cells[1];
            cells.innerHTML = mem.opcodeMemory[_CPU.PC];
            cells = rows.cells[2];
            cells.innerHTML = _CPU.Acc.toString();
            cells = rows.cells[3];
            cells.innerHTML = _CPU.Xreg.toString();
            cells = rows.cells[4];
            cells.innerHTML = _CPU.Yreg.toString();
            cells = rows.cells[5];
            cells.innerHTML = _CPU.Zflag.toString();
        };
        Control.updatePcbTable = function () {
            if (currentlyExecuting != null) {
                var rows = pcbReadyQueueTable.rows[1];
                var cells = rows.cells[0];
                cells.innerHTML = currentlyExecuting.pid.toString();
                cells = rows.cells[1];
                cells.innerHTML = currentlyExecuting.PC.toString();
                cells = rows.cells[2];
                cells.innerHTML = mem.opcodeMemory[_CPU.PC];
                cells = rows.cells[3];
                cells.innerHTML = currentlyExecuting.Acc.toString();
                cells = rows.cells[4];
                cells.innerHTML = currentlyExecuting.Xreg.toString();
                cells = rows.cells[5];
                cells.innerHTML = currentlyExecuting.Yreg.toString();
                cells = rows.cells[6];
                cells.innerHTML = currentlyExecuting.Zflag.toString();
                cells = rows.cells[7];
                cells.innerHTML = currentlyExecuting.base.toString();
                cells = rows.cells[8];
                cells.innerHTML = currentlyExecuting.limit.toString();
                cells = rows.cells[9];
                cells.innerHTML = currentlyExecuting.state.toString();
            }
            if (readyQueue.index(0) != null) {
                rows = pcbReadyQueueTable.rows[2];
                cells = rows.cells[0];
                cells.innerHTML = readyQueue.index(0).pid.toString();
                cells = rows.cells[1];
                cells.innerHTML = readyQueue.index(0).PC.toString();
                cells = rows.cells[2];
                cells.innerHTML = mem.opcodeMemory[readyQueue.index(0).PC];
                cells = rows.cells[3];
                cells.innerHTML = readyQueue.index(0).Acc.toString();
                cells = rows.cells[4];
                cells.innerHTML = readyQueue.index(0).Xreg.toString();
                cells = rows.cells[5];
                cells.innerHTML = readyQueue.index(0).Yreg.toString();
                cells = rows.cells[6];
                cells.innerHTML = readyQueue.index(0).Zflag.toString();
                cells = rows.cells[7];
                cells.innerHTML = readyQueue.index(0).base.toString();
                cells = rows.cells[8];
                cells.innerHTML = readyQueue.index(0).limit.toString();
                cells = rows.cells[9];
                cells.innerHTML = readyQueue.index(0).state.toString();
            }
            if (readyQueue.index(1) != null) {
                rows = pcbReadyQueueTable.rows[3];
                cells = rows.cells[0];
                cells.innerHTML = readyQueue.index(1).pid.toString();
                cells = rows.cells[1];
                cells.innerHTML = readyQueue.index(1).PC.toString();
                cells = rows.cells[2];
                cells.innerHTML = mem.opcodeMemory[readyQueue.index(1).PC];
                cells = rows.cells[3];
                cells.innerHTML = readyQueue.index(1).Acc.toString();
                cells = rows.cells[4];
                cells.innerHTML = readyQueue.index(1).Xreg.toString();
                cells = rows.cells[5];
                cells.innerHTML = readyQueue.index(1).Yreg.toString();
                cells = rows.cells[6];
                cells.innerHTML = readyQueue.index(1).Zflag.toString();
                cells = rows.cells[7];
                cells.innerHTML = readyQueue.index(1).base.toString();
                cells = rows.cells[8];
                cells.innerHTML = readyQueue.index(1).limit.toString();
                cells = rows.cells[9];
                cells.innerHTML = readyQueue.index(1).state.toString();
            }
        };
        return Control;
    })();
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
