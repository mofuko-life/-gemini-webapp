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
  // リクエストからユーザーの質問テキストを取得
  const userQuestion = req.body.question;
  if (!userQuestion) {
    return res.status(400).json({ error: '質問が空です。' });
  }

  // 犬の行動心理学に特化させるための指示
  const systemInstruction = "あなたは犬の行動心理学の専門家です。犬の行動や訓練に関する質問に、行動心理学の観点から、その行動の理由や背景を解説し、科学的根拠に基づいた具体的なしつけ方を、分かりやすく具体的に答えてください。";

  // Geminiに送る最終的な質問を組み立てる
  const fullQuestion = `${systemInstruction} ${userQuestion}`;

  // コマンドラインで実行するコマンドを組み立てる
  // 注意：実際のパスに合わせて /Users/sayami/ask_gemini.sh の部分を修正してください
  const command = `/Users/sayami/ask_gemini.sh "${fullQuestion.replace(/"/g, '"')}" "${apiKey}"`;

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
