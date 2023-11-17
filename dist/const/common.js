"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = exports.StageExercise = exports.ENROLLMENT_STAGE = exports.Category = exports.ROLE = void 0;
exports.ROLE = {
    developer: 'developer',
    designer: 'designer',
    others: 'others'
};
exports.Category = {
    general: 'general',
    developer: 'developer',
    designer: 'designer'
};
exports.ENROLLMENT_STAGE = {
    IN_PROGRESS: 0,
    EXPLORE: 1,
    FINISHED: 2
};
var StageExercise;
(function (StageExercise) {
    StageExercise[StageExercise["Open"] = 0] = "Open";
    StageExercise[StageExercise["Inprogress"] = 1] = "Inprogress";
    StageExercise[StageExercise["Close"] = 2] = "Close";
})(StageExercise || (exports.StageExercise = StageExercise = {}));
exports.Language = {
    Vn: 'vn',
    Kr: 'kr',
    Us: 'us'
};
