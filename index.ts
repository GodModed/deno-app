const server = Deno.listen({ port: 3000 });

for await (const conn: Deno.Conn of server) {
    const ip = (conn.remoteAddr as { hostname: string }).hostname!;
    await handleConnection(conn, ip);
}

async function handleConnection(conn: Deno.Conn, ip: string) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
        const url = new URL(requestEvent.request.url);
        await handleURL(requestEvent, url, ip);
    }
}

async function handleURL(requestEvent: Deno.RequestEvent, url: URL, ip: string) {
    if (url.pathname == '/') url.pathname = '/index.html';
    const filePath = `./generatePI${url.pathname}`;
    try {
        requestEvent.respondWith(
            new Response(await Deno.readFile(filePath), {
                status: 200,
                headers: {
                }
            })
        )
    } catch(e) {
        requestEvent.respondWith(
            new Response(String(e), {
                status: 404,
            })
        ).catch(console.log)
    }
    console.log(`REQUEST HANDLED: ${url.pathname} served to ${ip}`);
}