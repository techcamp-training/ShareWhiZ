const express = require("express");
const app = express();

// prismaの読み込み
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 画像アップロードの設定
const multer = require('multer');

// corsをインポート
const cors = require('cors')

// クライアントからアップロードされたファイルの保存ディレクトリをuploads/に設定
const upload = multer({ dest: 'uploads/' });

// corsをインポートして、アプリケーションに適用させる記述
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ミドルウェア設定
app.use(express.json())

// クライアントがブラウザから画像にアクセスするためのURL
app.use('/uploads', express.static('uploads'))

// 全ての投稿取得処理
app.get("/posts", async(req, res) => {
  try {
  const AllPosts = await prisma.post.findMany();
  const updatedPosts = AllPosts.map((post) => {
    if (post.image_url) {
      post.image_url = `http://localhost:3000/${post.image_url}`
    } else {
      post.image_url = null;
    }
    return post;
  });
  res.json(updatedPosts)
  } catch(error) {
  console.log(error)
  }
})

// 投稿保存処理の実装
app.post('/posts', upload.single('image'), async (req, res) => {
  const imagePath = req.file ? req.file.path : null; // アップロードした画像のパス

  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        user_id: req.body.user_id,
        image_url: imagePath,
      },
    });

    if (post.image_url) {
      post.image_url = `http://localhost:3000/${post.image_url}`
    } else {
      post.image_url = null;
    }

    res.json(post)
  }catch(error) {
    console.log(error)
    res.status(500).send("データの保存に失敗しました");
  }
})

// 投稿タイトルの検索処理の実装
app.get('/search', async (req, res) => {
  const query = req.query.q || '';

  try {
    // タイトルにクエリを含む投稿を検索
    const posts = await prisma.post.findMany({
      where: {
        title: {
          contains: query, // タイトルにクエリを含む
          mode: 'insensitive' // 大文字小文字を区別しない
        }
      },
      orderBy: {
        created_at: 'desc' // 最新の投稿を上に表示
      }
    });

    const updatedPosts = posts.map((post) => {
      if (post.image_url) {
        post.image_url = `http://localhost:3000/${post.image_url}`
      } else {
        post.image_url = null;
      }
      return post;
    });
    res.json(updatedPosts)// 検索結果を返す
  } catch (error) {
    console.error("検索処理に失敗しました:", error);
    res.status(500).json({ message: "検索処理に失敗しました" });
  }
});

// サーバ起動
app.listen(3000, () => {
  console.log("listening on localhost 3000")
})