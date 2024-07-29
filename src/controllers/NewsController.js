const News = require("../models/news");
const bucket = require("../helpers/firebaseConfig");
const multer = require("multer");
const { format } = require("util");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const NewsController = {
  Delete: async (req, res) =>{
    const newsId = req.params.id;
    await News.destroy({where: {id: newsId}});
    res.redirect("/admin/getall");
  },
  postUpdate: async (req, res) => {
    const newsId = req.params.id;
    upload.single("img")(req, res, async (err) => {
        if (err) {
            return res.status(500).send("uploading file thất bại");
        }

        const { title, content, existingImg } = req.body;
        const img = req.file;

        try {
            const news = await News.findOne({ where: { id: newsId } });

            if (!news) {
                return res.status(404).send("Không có bài báo nào");
            }

            if (img) {
                const blob = bucket.file(`news_web/${img.originalname}`);
                const blobStream = blob.createWriteStream({
                    resumable: false,
                    contentType: img.mimetype,
                });

                blobStream.on("error", (err) => {
                    console.error(err);
                    return res.status(500).send("upload firebase thất bại");
                });

                blobStream.on("finish", async () => {
                    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

                    try {
                        news.title = title;
                        news.content = content;
                        news.img = publicUrl;
                        await news.save();
                        return res.redirect("/");
                    } catch (error) {
                        console.error("lỗi không update dc", error);
                        return res.status(500).send("Lỗi không update dc");
                    }
                });

                blobStream.end(img.buffer);
            } else {
                try {
                    news.title = title;
                    news.content = content;
                    news.img = existingImg; 
                    await news.save();
                    return res.redirect("/");
                } catch (error) {
                    console.error("lỗi không update dc", error);
                    return res.status(500).send("lỗi không update dc");
                }
            }
        } catch (error) {
            console.error("Server error:", error);
            return res.status(500).send("Server error");
        }
    });
},
  Edit: async (req, res) => {
    const cardId = req.params.id;
    const news = await News.findOne({ where: { id: cardId } });
    if (news) {
      res.render("admin/updateNews", { news: news });
    } else {
      res.status(404).send("Không có bài báo");
    }
  },
  DetailAdmin: async (req, res) => {
    const cardId = req.params.id;
    const news = await News.findOne({ where: { id: cardId } });
    if (news) {
      news.views = news.views + 1;
      await news.save();
      res.render("admin/newsDetailAdmin", { news: news });
    } else {
      res.status(404).send("Không có bài báo");
    }
  },
  DetailUser: async (req, res) => {
    const cardId = req.params.id;
    const news = await News.findOne({ where: { id: cardId } });
    if (news) {
      news.views = news.views + 1;
      await news.save();
      res.render("user/newsDetailUser", { news: news });
    } else {
      res.status(404).send("Không có bài báo");
    }
  },
  HomeAdmin: async (req, res) => {
    res.render("admin/homeAdmin");
  },
  Create: (req, res) => {
    const img = null;
    res.render("admin/createNews", { img });
  },
  postCreate: async (req, res) => {
    upload.single("img")(req, res, async (err) => {
      if (err) {
        return res.status(500).send("uploaf file thất bại.");
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

          blobStream.on("error", (err) => {
            console.error(err);
            return res.status(500).send("k upload được lên firebase");
          });

          blobStream.on("finish", async () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
              bucket.name
            }/o/${encodeURIComponent(blob.name)}?alt=media`;

            try {
              const newNews = await News.create({
                title,
                content,
                img: publicUrl,
              });
              res.redirect("/");
            } catch (error) {
              console.error("tạo bài báo thất bại", error);
              res.status(500).send("tạo bài báo thất bại");
            }
          });

          blobStream.end(img.buffer);
        } else {
          res.status(400).send("không có file upload");
        }
      } catch (error) {
        console.error("Server error:", error);
        res.status(500).send("Server error");
      }
    });
  },
  GetAll: async (req, res) => {
    try {
      const listnews = await News.findAll();
      return res.render("admin/homeAdmin", { listnews });
    } catch (error) {
      res.status(500).send("server err");
    }
  },
};

module.exports = NewsController;
