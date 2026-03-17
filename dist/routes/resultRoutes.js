"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const examController_1 = require("../controllers/examController");
const router = (0, express_1.Router)();
router.get('/allresult', examController_1.getAllResult);
exports.default = router;
