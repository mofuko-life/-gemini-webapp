// 必要なライブラリを読み込む
require('dotenv').config(); // .envファイルから環境変数を読み込む
const express = require('express');
const { exec } = require('child_process');
const path = require('path');

// Expressアプリを作成
const app = express();
const port = process.env.PORT || 3000; // Renderが指定するポートまたは3000番を使う

// APIキーを環境変数から取得
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error('エラー: API_KEYが設定されていません。');
  process.exit(1); // APIキーがない場合はサーバーを停止
}

// JSON形式のリクエストを解釈できるようにする
app.use(express.json());
// publicディレクトリ内の静的ファイル（HTML, JS, CSSなど）を配信する
app.use(express.static('public'));

// '/ask' というURLへのPOSTリクエストを処理する部分
app.post('/ask', (req, res) => {
  // リクエストから質問テキストを取得
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: '質問が空です。' });
  }

  // コマンドラインで実行するコマンドを組み立てる
  // 注意：実際のパスに合わせて /Users/sayami/ask_gemini.sh の部分を修正してください
  const command = `/Users/sayami/ask_gemini.sh "${question.replace(/"/g, '"')}" "${apiKey}"`;

  // コマンドを実行
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`実行エラー: ${error}`);
      return res.status(500).json({ error: 'スクリプトの実行に失敗しました。' });
    }
    if (stderr) {
      console.error(`標準エラー: ${stderr}`);
    }

    try {
      // Gemini APIからのJSON応答をパースする
      const jsonResponse = JSON.parse(stdout);
      // 回答部分のテキストを抽出する
      const answer = jsonResponse.candidates[0].content.parts[0].text;
      // 抽出したテキストをブラウザに送る
      res.json({ answer: answer });
    } catch (e) {
      console.error('JSONのパースに失敗しました:', e);
      res.status(500).json({ error: 'APIからの応答の解析に失敗しました。' });
    }
  });
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
