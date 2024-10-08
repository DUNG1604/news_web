const News = require("../models/news");
const bucket = require("../helpers/firebaseConfig");
const multer = require("multer");
const { format } = require("util");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { Op } = require("sequelize");
const jwtHelper = require("../helpers/jwt.helper");
const Like = require("../models/like_post");
const User = require("../models/user");
const { sequelize } = require("../helpers/ConnectDB");

const NewsController = {
  GetHomeUser: async (req, res) => {
    try {
      const listnews = await News.findAll({
        where: {
          status: 'accept'
        }
      });
      return res.render("home", { listnews });
    } catch (error) {
      res.status(500).send("server err");
    }
  },
  Like: async (req, res) => {
    try {
      const likePost = await Like.create({});
      return res.status(200).send("đã like");
    } catch (error) {
      return res.status(401).send("server err");
    }

  },
  Search: async (req, res) => {
    const { search } = req.body;
    const results = await News.findAll({
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
        status: 'accept'
      },
    });
    const data = results.map((news) => news.dataValues);
    return res.status(200).json(data);
  },
  SearchAuthor: async (req, res) => {
    const { search } = req.body;
    const results = await News.findAll({
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
    });
    const data = results.map((news) => news.dataValues);
    return res.status(200).json(data);
  },
  Delete: async (req, res) => {
    const newsId = req.params.id;
    await News.destroy({ where: { id: newsId } });
    res.redirect("/author");
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
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
              }/o/${encodeURIComponent(blob.name)}?alt=media`;

            try {
              news.title = title;
              news.content = content;
              news.img = publicUrl;
              await news.save();
              return res.redirect("/author");
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
            return res.redirect("/author");
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
  AcceptedNews: async (req, res) => {
    try {
      const newsId = req.params.id;
      const news = await News.findOne({
        where: {
          id: newsId
        }
      })
      news.status = 'accept';
      await news.save();
      res.status(200).json({ message: "Chấp nhận" });
    } catch (error) {
      res.status(500).send('Có lỗi xảy ra khi chấp nhận bài đăng');
    }
  },
  RejectedNews: async (req, res) => {
    try {
      const newsId = req.params.id;
      const news = await News.findOne({
        where: {
          id: newsId
        }
      })
      news.status = 'reject';
      await news.save();
      res.status(200).json({ message: "Từ chối" });
    } catch (error) {
      res.status(500).send('Có lỗi xảy ra khi từ chối bài đăng');
    }
  },
  Edit: async (req, res) => {
    const cardId = req.params.id;
    const news = await News.findOne({ where: { id: cardId } });
    if (news) {
      res.render("author/updateNews", { news: news });
    } else {
      res.status(404).send("Không có bài báo");
    }
  },
  DetailAdmin: async (req, res) => {
    const cardId = req.params.id;
    const news = await News.findOne({ 
      where: { 
        id: cardId 
      },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT username
              FROM users
              WHERE News.userId = users.id
            )`), 
            'authorName'
          ]
        ]
      },
    });
    if (news) {
      news.views = news.views + 1;
      await news.save();
      console.log(news);
      res.render("author/newsDetailAuthor", { news: news });
    } else {
      res.status(404).send("Không có bài báo");
    }
  },
  DetailUser: async (req, res) => {
    const cardId = req.params.id;
    const news = await News.findOne({
      where: {
        id: cardId
      }
    });
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
    res.render("author/createNews", { img });
  },
  postCreate: async (req, res) => {
    upload.single("img")(req, res, async (err) => {
      if (err) {
        return res.status(401).json({ error: "uploadfile thất bại" });
      }

      const { title, content1, category, userId } = req.body;
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
            return res
              .status(401)
              .json({ error: "không upload được file lên firebase" });
          });

          blobStream.on("finish", async () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
              }/o/${encodeURIComponent(blob.name)}?alt=media`;

            try {
              const newNews = await News.create({
                title,
                content: content1,
                category: category,
                img: publicUrl,
                userId: userId,
              });
              res.redirect("/author");
            } catch (error) {
              console.error("tạo bài báo thất bại", error);
              return res.status(401).json({ error: "Tạo bài thất bại" });
            }
          });

          blobStream.end(img.buffer);
        } else {
          return res.status(401).json({ error: "Không có file upload" });
        }
      } catch (error) {
        console.error("Server error:", error);
        res.status(500).send("Server error");
      }
    });
  },

  GetHomeAdmin: async (req, res) => {
    try {
      const listnews = await News.findAll();
      const countNews = await News.count();
      const countUser = await User.count({
        where: {
          role: 'user'
        }
      })
      const countAuthor = await User.count({
        where: {
          role: 'author'
        }
      })
      return res.render("admin/homeAdmin", { listnews, countNews, countUser, countAuthor });
    } catch (error) {
      res.status(500).send("server err");
    }
  },
  GetAllNews: async (req, res) => {
    try {
      const listnews = await News.findAll();
      return res.render("admin/ManagerNews", { listnews });
    } catch (error) {
      res.status(500).send("server err");
    }
  },
  GetNewsPending: async (req, res) => {
    try {
      const listNewsPending = await News.findAll({
        where: {
          status: 'pending'
        },
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT username
                FROM users AS User
                WHERE User.id = News.userId
              )`),
              'nameAuthor'
            ]
          ]
        },
        raw: true,
        nest: true
      })
      const listNewsAccept = await News.findAll({
        where: {
          status: 'accept'
        },
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT username
                FROM users AS User
                WHERE User.id = News.userId
              )`),
              'nameAuthor'
            ]
          ]
        },
        raw: true,
        nest: true
      })
      const listNewsReject = await News.findAll({
        where: {
          status: 'reject'
        },
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT username
                FROM users AS User
                WHERE User.id = News.userId
              )`),
              'nameAuthor'
            ]
          ]
        },
        raw: true,
        nest: true
      })
      return res.render("admin/ManagerNews", { listNewsAccept, listNewsPending, listNewsReject });
    } catch (error) {
      console.log(error)
      res.status(500).send("server err");
    }
  },
  GetByIdUser: async (req, res) => {
    try {
      const userId = req.jwtDecoded.data.id;
      console.log("idAuthor: ", userId);
      const listnewsPending = await News.findAll({
        where: {
          userId: userId,
          status: 'pending'
        },
      });
      const listnewsAccept = await News.findAll({
        where: {
          userId: userId,
          status: 'accept'
        },
      });
      const listnewsReject = await News.findAll({
        where: {
          userId: userId,
          status: 'reject'
        },
      });
      return res.render("author/homeAuthor", { listnewsPending, listnewsAccept, listnewsReject });
    } catch (error) {
      res.status(500).send("Không lấy được thông tin");
    }
  },
};

module.exports = NewsController;
