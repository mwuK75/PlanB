// server.js

// Deno.serveを使ってサーバーを立ち上げます
Deno.serve(async (req) => {
  // アクセスされたURLのパス（/login.html など）を取得
  const url = new URL(req.url);
  const pathname = url.pathname;

  // --- 1. API処理（ログイン認証） ---
  // POSTメソッドで、かつパスが "/api/login" の場合
  if (req.method === "POST" && pathname === "/api/login") {
    try {
      // クライアントから送られたデータ（JSON）を取り出す
      const json = await req.json();
      const email = json.email;
      const password = json.password;

      // サーバー側で正解データと照合（ここはユーザーからは見えません）
      const VALID_EMAIL = "123456@mwu.jp";
      const VALID_PASSWORD = "mukogawa";

      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        // 成功時のレスポンス
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // 失敗時のレスポンス
        return new Response(JSON.stringify({ success: false }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      // エラー処理
      return new Response("Bad Request", { status: 400 });
    }
  }

  // --- 2. 静的ファイルの配信（HTML, CSS） ---
  // ルート（/）へのアクセスは login.html に転送
  let filePath = pathname;
  if (filePath === "/") {
    filePath = "/login.html";
  }

  // ファイルを読み込んで返す
  try {
    // 現在のディレクトリからファイルを読み込む
    const file = await Deno.readFile("." + filePath);
    
    // 拡張子に応じたContent-Typeを設定
    let contentType = "text/html";
    if (filePath.endsWith(".css")) {
      contentType = "text/css";
    } else if (filePath.endsWith(".js")) {
      contentType = "text/javascript";
    }

    return new Response(file, {
      headers: { "Content-Type": contentType },
    });

  } catch (e) {
    // ファイルが見つからない場合は404エラー
    return new Response("404 Not Found", { status: 404 });
  }
});