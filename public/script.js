// HTML要素を取得
const form = document.getElementById('chat-form');
const input = document.getElementById('question-input');
const responseDiv = document.getElementById('response');

// フォームが送信されたときの処理
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // ページのリロードを防ぐ
  const question = input.value;
  
  responseDiv.textContent = '考え中...'; // ローディング表示

  try {
    // バックエンド（server.js）にリクエストを送信
    const response = await fetch('/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question }),
    });

    const data = await response.json();

    if (data.error) {
      responseDiv.textContent = 'エラー: ' + data.error;
    } else {
      responseDiv.textContent = data.answer;
    }
  } catch (error) {
    responseDiv.textContent = '通信エラーが発生しました。';
    console.error('Error:', error);
  }
});
