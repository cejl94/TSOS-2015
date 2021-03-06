/**
 * Created by cejl94 on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    var memory = (function () {
        // memory is represented by an array of strings
        function memory(opcodeMemory) {
            if (opcodeMemory === void 0) { opcodeMemory = []; }
            this.opcodeMemory = opcodeMemory;
        }
        // initalize the length to 256
        // as stated in lab 5, increase memory to 768
        memory.prototype.init = function () {
            for (var i = 0; i < 768; i++) {
                this.opcodeMemory[i] = "00";
            }
        };
        return memory;
    })();
    TSOS.memory = memory;
})(TSOS || (TSOS = {}));
