module TSOS {

export class memoryManager {

    public counter: number = 0
    public baseReg: number = 0;
    public limitReg: number = 255;
    public memoryPlace: number = this.baseReg;

// this method will actually load the user input into memory

        public loadInputToMemory(instructions: string, priority: number):void {
            //_StdOut.putText("memoryplace LOoaded, pid = " + this.memoryPlace);


            // has the program that was loaded into memory breached its respective bounds?
            // for now check after its been added in, if it did breach into the next block of memory, clear the memory
            //
           if(instructions.length/2 > 256){

               _StdOut.putText("Memory out of bounds error: program too long. Reload program");

           }

           else {




               // first check if you're trying to add into memory that doesnt exist
               if (this.limitReg > 767) {

                   // load a program to the disk in this space.

                   prosBlock = new pcb();
                   prosBlock.init(pid, 0,0,0, priority, "disk");
                   residentList.push(prosBlock);
                   fileSystemDeviceDriver.createFile("process" + prosBlock.pid.toString());
                   //_StdOut.advanceLine();
                   fileSystemDeviceDriver.writeFile("process" + prosBlock.pid.toString(), instructions);


                   Control.updateFileSystemTable();
                   pid++;
                   _StdOut.putText("Program loaded to disk successfully");

               }
               //If the memory exists, start loading in starting at the index of the base register
               //after you load into memory, create the process control block, and then add it to the resident list
               else {
                   // Loop through each two character "byte" of user input
                   for (var i = 0; i < instructions.length; i += 2) {



                       // concat two characters to make a byte, and then store in it memory
                       var buildOpCode = instructions.charAt(i) + instructions.charAt(i + 1);


                       //start loading the program into memory at the base register and go from there.
                       mem.opcodeMemory[this.memoryPlace] = buildOpCode;

                       this.memoryPlace++;


                   }


                   prosBlock = new pcb();
                   //given that load increases the base and the limit after the load is complete, we must get the previous base and limit
                   prosBlock.init(pid, this.baseReg, this.limitReg, this.counter, priority, "memory");
                   _StdOut.putText("Program successfully loaded, pid = " + prosBlock.pid);
                   _Kernel.krnTrace("Program successfully loaded, PRIORITY = " + prosBlock.priority.toString());

                   _StdOut.advanceLine();
                   _StdOut.putText("Base = " + prosBlock.base + " Limit = " + prosBlock.limit);
                   //_StdOut.putText("Memory base = " + prosBlock.base + " Memory Limit = " + prosBlock.limit );
                   _Kernel.krnTrace("resident list length" + residentList.length);

                   residentList.push(prosBlock);
                   _Kernel.krnTrace("resident list pid = " + residentList[residentList.length - 1].pid );
                   _Kernel.krnTrace("resident list PC = " + residentList[residentList.length - 1].PC );
                   pid++;
                   Control.updateMemoryTable();
                   // after each load, set the new base equal to what it should be for the next block (limit + 1)
                   // same for limit - increase the limitReg by 256.
                   // upon next call to load, program will be loaded in the correct spots


                       this.counter = this.limitReg +1;
                       this.baseReg = this.limitReg + 1;
                       this.limitReg = this.limitReg + 256;
                       this.memoryPlace = this.baseReg;
                   //_StdOut.putText("memoryplace oaded, pid = " + this.memoryPlace);



               }
           }




        }


        public readCodeInMemory(address: number):string{
            return mem.opcodeMemory[address];

        }

        public clearMemory():void{
            for(var i = 0; i < mem.opcodeMemory.length; i++){
                mem.opcodeMemory[i] = "00";
                //must also empty resident list and ready queue

            }

            //reset all tables that were updated, the ready queue and resident lsit, and set the PC, base, limit and index
            //counters back to their originals. For now pid also sets back to 0
            _CPU.resetCPU();

            Control.updateMemoryTable();
            Control.updateCPUtable();
            residentList = [];
            readyQueue = new Queue();
            this.counter = 0;
            this.baseReg = 0;
            this.limitReg = 255;
            this.memoryPlace = this.baseReg;


        }

        public clearSegment(base: number, limit: number):void{

            for(var i = base; i < limit; i++){
                mem.opcodeMemory[i] = "00";
                // just clears this stuff right outta that memory segment
            }
            Control.updateMemoryTable();
        }

        public findFreeSegment():void{

            for(var i = 0; i < mem.opcodeMemory.length; i++){
               // if(mem)
            }
        }

        public getOpCodeStringFromMemory(base:number, limit:number):string{

            var opCodeString ="";
            for(var i = base; i < limit; i++){

               // _Kernel.krnTrace("CODES FOR SWAPPING ARE " + mem.opcodeMemory[i]);
                opCodeString  += mem.opcodeMemory[i];


            }
           // _Kernel.krnTrace("OPCODE STRIGNG PRE HEX MEM IS " + opCodeString);
            //_Kernel.krnTrace("OPCODE STRING FROM MEMORY IS " + fileSystemDeviceDriver.convertStringToHex(opCodeString));
            return opCodeString;
        }
    }
}