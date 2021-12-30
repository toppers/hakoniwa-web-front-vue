export interface SimulationStatus {
    state: string;
    simtime: string;
}

export function convertStateToViewStatus(state: string) : string {
    if (state === "stopped") {
        return "停止";
    }
    else if (state === "runnable") {
        return "実行準備中";
    }
    else if (state === "running") {
        return "実行中";
    }
    else if (state === "stopping") {
        return "停止中";
    }
    return "unknown";
}

export function convertStateToViewAction(state: string) : string {
    if (state === "stopped") {
        return "開始";
    }
    else if (state === "runnable") {
        return "停止";
    }
    else if (state === "running") {
        return "停止";
    }
    else if (state === "stopping") {
        return "停止";
    }
    return "unknown";
}