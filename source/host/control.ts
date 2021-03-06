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
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            coreMemoryTable= <HTMLTableElement> document.getElementById("coreMemoryTable");
            cpuTable=<HTMLTableElement> document.getElementById("cpuTable");
            pcbReadyQueueTable=<HTMLTableElement> document.getElementById("pcbReadyQueueTable");
            fileSystemTable=<HTMLTableElement> document.getElementById("fileSystemTable");


            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

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
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }

        // This method posts the time to the task bar. Updates will be made to allow for the time and status
        //on the task bar at the same time
        public static hostTaskBar(): void {
            // Make the date
            var date = new Date();
            var month = date.getMonth() + 1;
            var day  = date.getDate();
            var year  = date.getFullYear();
            var hours  = date.getHours();
            var minutes   = date.getMinutes();
            var seconds   = date.getSeconds();
            // Build the date string
            if(seconds <=9){
                var str = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":0" + seconds;
            }
            else {

            var str = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
            }
            var htb = <HTMLInputElement> document.getElementById("htbOutput1");
            htb.value = str;
            //update the time every second
            setTimeout(Control.hostTaskBar, 1000);
            // TODO in the future: Optionally update a log database or some streaming service.
        }



        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();
            memManager = new memoryManager();//       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            mem = new memory();
            mem.init();
            fileSystemDD = new fileSystemDeviceDriver();
            fileSystemDD.init();



            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.

            //on startup, display the current date and time in the task bar
           Control.hostTaskBar();


        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static createMemoryTable():void {

            //32 rows(768/8) = 96
            //9 columns incleading a header


            for(var x = 0; x < 96; x++){
                var row = <HTMLTableRowElement>coreMemoryTable.insertRow(x);
                for(var y = 0; y < 9; y++){
                    var cell = row.insertCell(y);
                    if(y== 0){
                        var header = (x*8).toString(16);
                        cell.innerHTML = "0x" + header;


                    }
                    else{
                        cell.innerHTML = "00";
                    }

                }
            }


        }
        public static updateMemoryTable():void{

            //this will grab the opCode sitting in memory
            var counter = 0;

            //pretty much the same thing as initialize, just with different values

            for(var x = 0; x < 96; x++){
                var rows = <HTMLTableRowElement>coreMemoryTable.rows[x];
                for(var y = 0; y < 9; y++){
                    var cell = <HTMLElement>rows.cells[y];
                    if(y== 0){
                        var header = (x*8).toString(16);
                        cell.innerHTML = "0x" + header;


                    }
                    else{
                        cell.innerHTML = mem.opcodeMemory[counter];
                        counter++;
                    }

                }

            }
        }

        public static createFileSystemTable():void{


            for(var x = 0; x < 256; x++){
                var row = <HTMLTableRowElement>fileSystemTable.insertRow(x);

                for(var columns = 0; columns < 2; columns++){
                    var cell = row.insertCell(columns);
                    if(columns ==0){
                      cell.innerHTML = sessionStorage.key(x);
                    }
                    else{
                        cell.innerHTML = sessionStorage.getItem(sessionStorage.key(x));
                    }
                }
            }
        }


        public static updateFileSystemTable():void{


            for(var x = 0; x < 256; x++){
                var row = <HTMLTableRowElement>fileSystemTable.rows[x];

                for(var columns = 0; columns < 2; columns++){
                    var cell = <HTMLElement>row.cells[columns];
                    if(columns ==0){
                        cell.innerHTML = sessionStorage.key(x);
                    }
                    else{
                        cell.innerHTML = sessionStorage.getItem(sessionStorage.key(x));
                    }
                }
            }
        }

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





        public static updateCPUtable():void{

            var rows = <HTMLTableRowElement>cpuTable.rows[1];
            var cells = <HTMLElement>rows.cells[0];

            cells.innerHTML = _CPU.PC.toString();
            cells = <HTMLElement>rows.cells[1];
            cells.innerHTML = mem.opcodeMemory[_CPU.PC];
            cells = <HTMLElement>rows.cells[2];
            cells.innerHTML = _CPU.Acc.toString();
            cells = <HTMLElement>rows.cells[3];
            cells.innerHTML = _CPU.Xreg.toString();
            cells = <HTMLElement>rows.cells[4];
            cells.innerHTML = _CPU.Yreg.toString();
            cells = <HTMLElement>rows.cells[5];
            cells.innerHTML = _CPU.Zflag.toString();




        }

        public static updatePcbTable():void{


            if(currentlyExecuting != null) {
                var rows = <HTMLTableRowElement>pcbReadyQueueTable.rows[1];
                var cells = <HTMLElement>rows.cells[0];
                cells.innerHTML = currentlyExecuting.pid.toString();
                cells = <HTMLElement>rows.cells[1];
                cells.innerHTML = currentlyExecuting.PC.toString();
                cells = <HTMLElement>rows.cells[2];
                cells.innerHTML = mem.opcodeMemory[_CPU.PC];
                cells = <HTMLElement>rows.cells[3];
                cells.innerHTML = currentlyExecuting.Acc.toString();
                cells = <HTMLElement>rows.cells[4];
                cells.innerHTML = currentlyExecuting.Xreg.toString();
                cells = <HTMLElement>rows.cells[5];
                cells.innerHTML = currentlyExecuting.Yreg.toString();
                cells = <HTMLElement>rows.cells[6];
                cells.innerHTML = currentlyExecuting.Zflag.toString();
                cells = <HTMLElement>rows.cells[7];
                cells.innerHTML = currentlyExecuting.base.toString();
                cells = <HTMLElement>rows.cells[8];
                cells.innerHTML = currentlyExecuting.limit.toString();
                cells = <HTMLElement>rows.cells[9];
                cells.innerHTML = currentlyExecuting.state.toString();
            }

            if(readyQueue.index(0) != null) {
                rows = <HTMLTableRowElement>pcbReadyQueueTable.rows[2];
                cells = <HTMLElement>rows.cells[0];
                cells.innerHTML = readyQueue.index(0).pid.toString();
                cells = <HTMLElement>rows.cells[1];
                cells.innerHTML = readyQueue.index(0).PC.toString();
                cells = <HTMLElement>rows.cells[2];
                cells.innerHTML = mem.opcodeMemory[readyQueue.index(0).PC];
                cells = <HTMLElement>rows.cells[3];
                cells.innerHTML = readyQueue.index(0).Acc.toString();
                cells = <HTMLElement>rows.cells[4];
                cells.innerHTML = readyQueue.index(0).Xreg.toString();
                cells = <HTMLElement>rows.cells[5];
                cells.innerHTML = readyQueue.index(0).Yreg.toString();
                cells = <HTMLElement>rows.cells[6];
                cells.innerHTML = readyQueue.index(0).Zflag.toString();
                cells = <HTMLElement>rows.cells[7];
                cells.innerHTML = readyQueue.index(0).base.toString();
                cells = <HTMLElement>rows.cells[8];
                cells.innerHTML = readyQueue.index(0).limit.toString();
                cells = <HTMLElement>rows.cells[9];
                cells.innerHTML = readyQueue.index(0).state.toString();
            }


                if(readyQueue.index(1) != null){
                rows = <HTMLTableRowElement>pcbReadyQueueTable.rows[3];
                cells = <HTMLElement>rows.cells[0];
                cells.innerHTML = readyQueue.index(1).pid.toString();
                cells = <HTMLElement>rows.cells[1];
                cells.innerHTML = readyQueue.index(1).PC.toString();
                cells = <HTMLElement>rows.cells[2];
                cells.innerHTML = mem.opcodeMemory[readyQueue.index(1).PC];
                cells = <HTMLElement>rows.cells[3];
                cells.innerHTML = readyQueue.index(1).Acc.toString();
                cells = <HTMLElement>rows.cells[4];
                cells.innerHTML = readyQueue.index(1).Xreg.toString();
                cells = <HTMLElement>rows.cells[5];
                cells.innerHTML = readyQueue.index(1).Yreg.toString();
                cells = <HTMLElement>rows.cells[6];
                cells.innerHTML = readyQueue.index(1).Zflag.toString();
                cells = <HTMLElement>rows.cells[7];
                cells.innerHTML = readyQueue.index(1).base.toString();
                cells = <HTMLElement>rows.cells[8];
                cells.innerHTML = readyQueue.index(1).limit.toString();
                cells = <HTMLElement>rows.cells[9];
                cells.innerHTML = readyQueue.index(1).state.toString();
            }




        }
    }
}
