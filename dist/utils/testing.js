"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../lib/api");
const config_1 = require("./config");
/** Define common attributes for DRY tests */
exports.testChannelName = 'tests';
/** Get information about a user */
function userInfo(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return api_1.get('users.info', { username }, true);
    });
}
exports.userInfo = userInfo;
/** Create a user and catch the error if they exist already */
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return api_1.post('users.create', user, true, /already in use/i);
    });
}
exports.createUser = createUser;
/** Get information about a channel */
function channelInfo(roomName) {
    return __awaiter(this, void 0, void 0, function* () {
        return api_1.get('channels.info', { roomName }, true);
    });
}
exports.channelInfo = channelInfo;
/** Create a room for tests and catch the error if it exists already */
function createChannel(name, members = [], readOnly = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return api_1.post('channels.create', { name, members, readOnly }, true);
    });
}
exports.createChannel = createChannel;
/** Send message from mock user to channel for tests to listen and respond */
function sendFromUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const testChannel = yield channelInfo(exports.testChannelName);
        const messageDefaults = { roomId: testChannel.channel._id };
        const data = Object.assign({}, messageDefaults, payload);
        yield api_1.login({ username: config_1.mockUser.username, password: config_1.mockUser.password });
        return api_1.post('chat.postMessage', data, true);
    });
}
exports.sendFromUser = sendFromUser;
/** Update message sent from mock user */
function updateFromUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api_1.login({ username: config_1.mockUser.username, password: config_1.mockUser.password });
        return api_1.post('chat.update', payload, true);
    });
}
exports.updateFromUser = updateFromUser;
/** Create a direct message session with the mock user */
function setupDirectFromUser() {
    return __awaiter(this, void 0, void 0, function* () {
        yield api_1.login({ username: config_1.mockUser.username, password: config_1.mockUser.password });
        return api_1.post('im.create', { username: config_1.botUser.username }, true);
    });
}
exports.setupDirectFromUser = setupDirectFromUser;
/** Initialise testing instance with the required users for SDK/bot tests */
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\nPreparing instance for tests...');
        try {
            // Verify API user can login
            const loginInfo = yield api_1.login(config_1.apiUser);
            if (loginInfo.status !== 'success') {
                throw new Error(`API user (${config_1.apiUser.username}) could not login`);
            }
            else {
                console.log(`API user (${config_1.apiUser.username}) logged in`);
            }
            // Verify or create user for bot
            let botInfo = yield userInfo(config_1.botUser.username);
            if (!botInfo.success) {
                console.log(`Bot user (${config_1.botUser.username}) not found`);
                botInfo = yield createUser(config_1.botUser);
                if (!botInfo.success) {
                    throw new Error(`Bot user (${config_1.botUser.username}) could not be created`);
                }
                else {
                    console.log(`Bot user (${config_1.botUser.username}) created`);
                }
            }
            else {
                console.log(`Bot user (${config_1.botUser.username}) exists`);
            }
            // Verify or create mock user for talking to bot
            let mockInfo = yield userInfo(config_1.mockUser.username);
            if (!mockInfo.success) {
                console.log(`Mock user (${config_1.mockUser.username}) not found`);
                mockInfo = yield createUser(config_1.mockUser);
                if (!mockInfo.success) {
                    throw new Error(`Mock user (${config_1.mockUser.username}) could not be created`);
                }
                else {
                    console.log(`Mock user (${config_1.mockUser.username}) created`);
                }
            }
            else {
                console.log(`Mock user (${config_1.mockUser.username}) exists`);
            }
            // Verify or create channel for tests
            let testChannelInfo = yield channelInfo(exports.testChannelName);
            if (!testChannelInfo.success) {
                console.log(`Test channel (${exports.testChannelName}) not found`);
                testChannelInfo = yield createChannel(exports.testChannelName);
                if (!testChannelInfo.success) {
                    throw new Error(`Test channel (${exports.testChannelName}) could not be created`);
                }
                else {
                    console.log(`Test channel (${exports.testChannelName}) created`);
                }
            }
            else {
                console.log(`Test channel (${exports.testChannelName}) exists`);
            }
            yield api_1.logout();
        }
        catch (e) {
            throw e;
        }
    });
}
exports.setup = setup;
//# sourceMappingURL=testing.js.map