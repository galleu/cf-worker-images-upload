addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});


function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path == "/upload" && request.method == "POST") {
        return uploadImage(request);
    } else {
        return new Response("404 Not found", { status: 404 });
    }
}


async function uploadImage(request) {
    const body = await request.formData();
    const image = body.get("file");
    const requireSignedURLs = !!body.get("requireSignedURLs");
    const metadata = body.get("metadata");

    const formData = new FormData();
    formData.append("file", image, image.name);
    formData.append("requireSignedURLs", requireSignedURLs);
    formData.append("metadata", metadata);

    return await fetch("https://api.cloudflare.com/client/v4/accounts/" + CLOUDFLARE_ACCOUNT_ID + "/images/v1", {
        method: "POST",
        headers: { "Authorization": "Bearer " + CLOUDFLARE_API_KEY },
        body: formData
    });
}