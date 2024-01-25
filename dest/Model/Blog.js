"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "comment" }],
});
exports.default = (0, mongoose_1.model)("Blog", BlogSchema);
//# sourceMappingURL=Blog.js.map