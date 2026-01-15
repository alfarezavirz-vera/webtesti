import session from "express-session";
import express from "express";
import fs from "fs-extra";
const app = express();

app.use(session({
    secret: "rahasiafareza",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 jam
}));

const ADMIN = { username: "admin", password: "admin123" };

export default async function handler(req, res) {
    if (req.method === "GET" && req.query.logout) {
        req.session.destroy(() => {
            res.writeHead(302, { Location: "/api/login.js" });
            res.end();
        });
        return;
    }

    if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            const params = new URLSearchParams(body);
            const username = params.get("username");
            const password = params.get("password");
            if (username === ADMIN.username && password === ADMIN.password) {
                req.session.admin = true;
                res.writeHead(302, { Location: "/api/index.js" });
            } else {
                res.writeHead(302, { Location: "/api/login.js?error=1" });
            }
            res.end();
        });
        return;
    }

    // Render form login sederhana
    res.setHeader("Content-Type", "text/html");
    res.end(`
    <h1>Login Admin</h1>
    ${req.query.error ? "<p style='color:red'>Username/Password salah</p>" : ""}
    <form method="POST">
        <input name="username" placeholder="Username" required>
        <input name="password" type="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
    `);
}