import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { validateTurnstileToken } from "./utils.js";
import { cors } from "hono/cors";
import { addNewEmail } from "./main.js";

const app = new Hono();

app.use(cors({ origin: "*" }));

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.post("/add-new-email", async (c) => {
    console.log(JSON.stringify(c.req));
    const body = await c.req.json();

    const email = body["email"];
    const turnstileToken = body["turnstileToken"];

    if (
        !email ||
        !turnstileToken ||
        typeof email !== "string" ||
        typeof turnstileToken !== "string"
    ) {
        console.log("missing params", { email, turnstileToken });
        return c.text("Missing or email or turnstileToken", 400);
    }

    // validate email
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) {
        console.log("email is not valid", { email, turnstileToken });
        return c.text("email is not valid", 400);
    }

    // validate turstile
    if (!(await validateTurnstileToken(turnstileToken))) {
        console.log("captcha failed", { email, turnstileToken });
        return c.text("Turnstile captcha was invalid/failed", 401);
    }

    // todo: actually add the email to our db and send welcome email
    await addNewEmail(email);

    return c.text("success");
});

// app.post("/add-new-email-2", async (c) => {
//     const body = await c.req.parseBody();

//     const email = body["email"];
//     const turnstileToken = body["cf-turnstile-response"];

//     if (!email || !turnstileToken) {
//         console.log("missing params", { email, turnstileToken });
//         return c.text("Missing or email or cf-turnstile-response", 400);
//     }

//     if (!(await validateTurnstileToken(turnstileToken))) {
//         console.log("captcha failed", { email, turnstileToken });
//         return c.text("Turnstile captcha was invalid/failed", 401);
//     }

//     return c.json({ email, turnstileToken });
// });

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});
