"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const connectToDatabase = async () => {
    try {
        await (0, mongoose_1.connect)(process.env.MONGODB_URL);
    }
    catch (err) {
        console.log(err);
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=connect.js.map