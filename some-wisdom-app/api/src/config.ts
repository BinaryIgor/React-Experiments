import path from "path";

function envVariableOrDefault(key: string, defaultValue: any) {
    return process.env[key] ?? defaultValue;
}

function envVariableAsNumberOrDefault(key: string, defaultValue: any) {
    try {
        return parseInt(envVariableOrDefault(key, defaultValue));
    } catch (e) {
        throw new Error(`Can't parse ${key} to number`);
    }
}

export const getConfig = () => {
    return {
        profile: envVariableOrDefault("PROFILE", "default"),
        server: {
            port: envVariableOrDefault("SERVER_PORT", 8080)
        },
        session: {
            //5 hours
            duration: envVariableAsNumberOrDefault("SESSION_DURATION", 5 * 60 * 60 * 1000),
            dir: envVariableOrDefault("SESSION_DIR", path.join("/tmp", "session")),
            refreshInterval: envVariableOrDefault("SESSION_REFRESH_INTERVAL", 60 * 1000),
        },
        // TODO: change to SQLite
        db: {
            path: envVariableOrDefault("DB_PATH", path.join(__dirname, "..", "assets", "db")),
        }
    }
};