import { HttpBindings } from "@hono/node-server";
type Env = {
    Bindings: HttpBindings & {};
};
export declare const createApp: (appName: string) => import("hono/hono-base").HonoBase<Env, {
    [x: string]: {};
} & {
    "/metrics": {
        $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}, "/">;
export {};
