import fs from "fs";

export function textFileContent(path: string): Promise<string> {
    return fs.promises.readFile(path, 'utf-8');
}

export function writeTextFileContent(path: string, content: string): Promise<void> {
    return fs.promises.writeFile(path, content);
}

export async function fileExists(path: string): Promise<boolean> {
    try {
        await fs.promises.stat(path);
        return true;
    } catch(e) {
        return false;
    }
}

export function deleteFile(path: string): Promise<void> {
    return fs.promises.unlink(path);
}