import fs from "fs-extra";
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
    const filePath = "data/testimoni.json";
    let testimoni = await fs.readJSON(filePath).catch(() => []);

    if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", async () => {
            const params = new URLSearchParams(body);
            const nama = params.get("nama");
            const pesan = params.get("pesan");
            testimoni.push({
                id: uuid(),
                nama,
                pesan,
                tanggal: new Date().toISOString().slice(0, 10)
            });
            await fs.writeJSON(filePath, testimoni);
            res.writeHead(302, { Location: "/api/index.js" });
            res.end();
        });
        return;
    }

    if (req.method === "GET") {
        const { delete: delId } = req.query;
        if (delId) {
            testimoni = testimoni.filter(t => t.id !== delId);
            await fs.writeJSON(filePath, testimoni);
            res.writeHead(302, { Location: "/api/index.js" });
            res.end();
            return;
        }
    }

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(testimoni));
}