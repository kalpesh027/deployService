"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
function clearQueue() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, redis_1.createClient)();
        yield client.connect();
        // List current queue
        const queue = yield client.lRange('build-queue', 0, -1);
        console.log('Current Queue:', queue);
        // Remove specific ID
        yield client.lRem('build-queue', 1, 'epwic');
        console.log('Queue after removing "epwic":', yield client.lRange('build-queue', 0, -1));
        // Clear entire queue
        yield client.del('build-queue');
        console.log('Queue after clearing:', yield client.lRange('build-queue', 0, -1));
        yield client.quit();
    });
}
clearQueue().catch(console.error);
