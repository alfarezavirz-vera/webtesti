import fs from "fs-extra";
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const upload = multer({
    storage: multer.diskStorage({
        destination: "public/uploads",
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, uuid() + ext);
        }
    })
});

export default async function handler(req, res) {
    const filePath = "data/produk.json";
    let produk = await fs.readJSON(filePath).catch(() => []);

    if (req.method === "POST") {
        upload.single("foto")(req, res, async err => {
            if (err) return res.end("Upload gagal");
            const { nama, deskripsi, harga } = req.body;
            produk.push({
                id: uuid(),
                nama,
                deskripsi,
                harga: parseInt(harga),
                foto: req.file.filename
            });
            await fs.writeJSON(filePath, produk);
            res.writeHead(302, { Location: "/api/index.js" });
            res.end();
        });
        return;
    }

    if (req.method === "GET") {
        const { delete: delId } = req.query;
        if (delId) {
            produk = produk.filter(p => p.id !== delId);
            await fs.writeJSON(filePath, produk);
            res.writeHead(302, { Location: "/api/index.js" });
            res.end();
            return;
        }
    }

    // render dashboard produk
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(produk));
}