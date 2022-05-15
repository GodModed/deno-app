import { serve } from "https://deno.land/std@0.139.0/http/server.ts";

const port = 3000;

const handler = async (req: Request): Promise<Response> => {
    let { pathname } = new URL(req.url);
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("host")
    try {
        if (pathname == "/") {
            pathname = "/index.html";
        }
        const filePath = `./generatePI${pathname}`;
        try {
            console.log(`Serving ${pathname} to ${ip}`);
            return new Response(await Deno.readFile(filePath), {
                status: 200,
            });
        } catch(e) {
            console.log(`Serving 404 to ${ip}`);
            return new Response(String(e), {
                status: 404,
            })
        } 
    } catch(e) {
        console.log(`Serving 500 to ${ip}`);
        return new Response(`Unable to get ${pathname}\nThis is on our end, sorry!\n${String(e)}`, {
            status: 500,
        });
    }
};

await serve(handler, { port });
