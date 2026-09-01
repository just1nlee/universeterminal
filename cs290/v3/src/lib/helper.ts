import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), "data");
const universeBasePath = path.join(dataDir, "universe_base.json");
const universeUserStatePath = path.join(dataDir, "universe_user_state.json");

export function readBaseUniverse() {
    return JSON.parse(fs.readFileSync(universeBasePath, "utf8"));
}

export function readUserStateUniverse() {
    return JSON.parse(fs.readFileSync(universeUserStatePath, "utf8"));
}

export function writeUserStateUniverse(data: string) {
    fs.writeFileSync(universeUserStatePath, JSON.stringify(data, null, 2));
}

export function resetUserStateUniverse() {
    const base = readBaseUniverse();
    writeUserStateUniverse(base);
}