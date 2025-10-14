
import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

dotenv.config();
const app = express();

app.use(cors({
  origin: "*", // ou ton frontend: "http://localhost:5173"
  methods: ["POST", "GET", "OPTIONS"],
}));
app.use(express.json({ limit: "10mb" }));
const upload = multer();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route test
app.get("/", (req, res) => {
  res.send("✅ Meme backend running");
});

// Route upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Fichier reçu :", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "memes" },
      (error, result) => {
        if (error) {
          console.error("Erreur Cloudinary :", error);
          return res.status(500).json({ error: "Erreur upload Cloudinary" });
        }

        console.log("✅ Upload Cloudinary réussi :", result.secure_url);
        res.json({ imageUrl: result.secure_url }); // 🔹 ESSENTIEL pour le frontend
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
