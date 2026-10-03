# ACE-SEP ホームページ（site/）

次世代計算科学グランドリーチプログラムの課題「次世代創薬を拓く実験・計算・AI融合型構造アンサンブル基盤（ACE-SEP）」のホームページ。
Vite + React で、ビルド時に全ページを静的HTMLとして書き出す。

## 公開
- リポジトリ：https://github.com/lsid-lab/GRIP-Structural_Ensemble（Public）
- `main` に push すると `.github/workflows/deploy.yml` が GitHub Pages に自動で公開する
  → https://lsid-lab.github.io/GRIP-Structural_Ensemble/
- 内部共有中のため `content/site.yaml` を `noindex: true` にしている。正式公開時に `false` にする
- 本番は理研サーバーへ移す予定。`BASE_PATH=/ npm run build` を実行し、`dist/` の中身をアップロードする

## 構成
- `content/` … 文章の元データ（`site.yaml`、`ja/`・`en/` の news / outreach / members（YAML）、greeting / overview（Markdown＋先頭の設定部分 frontmatter））
- `public/images/` … 画像
- `src/content.ts` … content/ の読み込みと入力チェック（zod）。エラーメッセージは学生向けに日本語で出す
- `src/entry-server.tsx` + `scripts/prerender.mjs` … ビルド後に各ページの HTML を書き出す
- URL：日本語は `/greeting/` など、英語は `/en/greeting/`（`englishEnabled: true` のときだけ生成される）
- サイト内のパスには必ず `withBase()`（コンポーネント内）か Router の `Link` を使う。GitHub Pages ではサブパス `/GRIP-Structural_Ensemble/` の下で公開されるため

## 作業ルール
- 学生アルバイトが触るのは `content/` と `public/images/` だけ（手順は EDITING.md）。それ以外で済むことはコード側に寄せない
- 色・余白などは `src/styles.css` の先頭にある `:root` の変数で一括管理（ネイビー＋青〜ティール〜緑のグラデーション）
- 電話番号・メールアドレスは掲載しない。写真はメタデータを除去し、横600px程度に縮小してから置く
- 変更後は `npm run build` が通ること、PC（1440px）とスマホ（375px）での表示を確認してから push する
- `node_modules` / `dist` / `dist-ssr` は Dropbox の同期対象外にしている。別のPCで作業するときは最初に `npm install` を実行する

## コマンド
`npm run dev`（開発用サーバー :5173）／`npm run build`（入力チェックと書き出し）／`npm run preview`（書き出した結果の確認 :4173）／`npm run check`（型チェック）
