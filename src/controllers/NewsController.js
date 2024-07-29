const News = require("../models/news");
const bucket = require("../helpers/firebaseConfig");
const multer = require("multer");
const { format } = require("util");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const NewsController = {
  HomeAdmin: async (req, res) => {
    res.render("admin/homeAdmin");
  },
  Create: (req, res) => {
    const img = null;
    res.render("create", { img });
  },
  postCreate : async (req, res) => {
    upload.single('img')(req, res, async (err) => {
      if (err) {
        return res.status(500).send('Error uploading file.');
      }
  
      const { title, content } = req.body;
      const img = req.file;
  
      try {
        if (img) {
          const blob = bucket.file(`news_web/${img.originalname}`);
          const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: img.mimetype,
          });
  
          blobStream.on('error', (err) => {
            console.error(err);
            return res.status(500).send('Error uploading file to Firebase.');
          });
  
          blobStream.on('finish', async () => {
            // Lấy URL công khai từ Firebase Storage
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
  
            try {
              const newNews = await News.create({ title, content, img: publicUrl });
              res.status(200).send(newNews);
            } catch (error) {
              console.error('Error creating news entry:', error);
              res.status(500).send('Error creating news entry.');
            }
          });
  
          blobStream.end(img.buffer);
        } else {
          res.status(400).send('No file uploaded.');
        }
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error');
      }
    });
  },
  GetAll: async (req, res) => {
    try {
      const listnews = await News.find({});
      return res.render("home", { listnews });
    } catch (error) {
      res.status(500).send("server err");
    }
  },
};

module.exports = NewsController;
