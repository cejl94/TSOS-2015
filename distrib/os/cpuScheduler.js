/**
 * Created by cejl94 on 11/10/15.
 */
var TSOS;
(function (TSOS) {
    var cpuScheduler = (function () {
        function cpuScheduler() {
        }
        // variable which contains the PCB that is currently executing
        // this class will contain the methods that do all of the switching of the process
        // control blocks during execution
        // dequeue the first element of the readyque into currentlyExecuting, and then use the properties of
        // the temp to update the CPU, then set this.isexecuting to true
        cpuScheduler.startExecution = function () {
            currentlyExecuting = readyQueue.dequeue();
            _CPU.updateCPU(currentlyExecuting);
            currentlyExecuting.state = 1;
            _CPU.isExecuting = true;
        };
        //method to switch process control blocks
        // if the counter in CPU reaches the quantum,
        // switch PCBS. also, if a 00 is reached, switch PCBs
        cpuScheduler.contextSwitch = function () {
            if (quantumCounter == quantum) {
                quantumCounter = 0;
                if (readyQueue.getSize() > 0) {
                    currentlyExecuting.state = 0;
                    _CPU.updatePCB(_CPU);
                    readyQueue.enqueue(currentlyExecuting);
                    currentlyExecuting = readyQueue.dequeue();
                    currentlyExecuting.state = 1;
                    _CPU.updateCPU(currentlyExecuting);
                }
            }
        };
        cpuScheduler.contextSwitchBreak = function () {
            quantumCounter = 0;
            _Kernel.krnTrace("BREAK SWTICH ---- READY Q SIZE IS" + readyQueue.getSize());
            // if(mem.opcodeMemory[_CPU.PC + 1] != "00" ) {
            if (readyQueue.getSize() >= 0) {
                _Kernel.krnTrace("LENGTH IS" + readyQueue.getSize());
                //_CPU.updatePCB(_CPU);
                currentlyExecuting.state = 2;
                currentlyExecuting = readyQueue.dequeue();
                if (currentlyExecuting == null) {
                    _CPU.isExecuting = false;
                    _StdOut.advanceLine();
                    _StdOut.putText("The program has finished running");
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
                else {
                    _CPU.updateCPU(currentlyExecuting);
                }
            }
            //}
        };
        return cpuScheduler;
    })();
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
