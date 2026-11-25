# ACE-SEP｜創薬構造アンサンブル基盤 ホームページ

Vite + React による静的サイトです。各ページは HTML として書き出されるため、どのWebサーバーにもそのまま置けます。

- 内容の更新方法 → [EDITING.md](EDITING.md)
- 内容は `content/`（YAML / Markdown）、画像は `public/images/` にあります

## コマンド
| コマンド | 内容 |
|---|---|
| `npm install` | 初回セットアップ |
| `npm run dev` | 開発用サーバー（http://localhost:5173） |
| `npm run build` | 入力チェック＋ `dist/` に書き出し |
| `npm run preview` | 書き出した `dist/` の確認 |

## 公開
### GitHub Pages（内部共有用）
1. このフォルダ（`site/`）をリポジトリのルートとして GitHub に push
2. リポジトリの Settings → Pages → Source を **GitHub Actions** にする
3. `main` に push するたびに `.github/workflows/deploy.yml` が自動で公開
   （URL：`https://<アカウント>.github.io/<リポジトリ名>/`）

※ GitHub Pages のサイトは、リポジトリが非公開でも **URL を知っていれば誰でも閲覧できます**。
`content/site.yaml` の `noindex: true` で検索エンジンには載りません。

### 理研サーバー（本番）
```
BASE_PATH=/ npm run build      # サブディレクトリに置く場合は BASE_PATH=/xxx/
```
`dist/` の中身をそのままアップロードします。正式公開時は `noindex: false` にします。

#### Ansible でデプロイ（hudtech.r-ccs.riken.jp:/var/www/ace/sep/）
踏み台 `mng-2-1.r-ccs.riken.jp` 経由で、ビルド → `rsync --delete` まで一括で行います。設定は `deploy/inventory.yml`。
```
brew install uv                            # 初回のみ。Ansible は uvx が自動で取得する
uvx --python 3.12 --from 'ansible-core<2.17' ansible-playbook -i deploy/inventory.yml deploy/riken.yml          # 本番に反映
uvx --python 3.12 --from 'ansible-core<2.17' ansible-playbook -i deploy/inventory.yml deploy/riken.yml --check  # 変更点の確認だけ
```
- 接続ユーザーは `makigaki`（`deploy/inventory.yml`）。別アカウントなら `-e ansible_user=xxx`
- 公開URLのパス（`BASE_PATH`）は `deploy/inventory.yml` の `base_path`（既定 `/ace/sep/`）

## 構成
```
content/        学生が編集するファイル（site.yaml, ja/, en/）
public/images/  画像
src/            React のコード（content.ts が読み込みと入力チェック）
scripts/        ビルド後に各ページの HTML を書き出すスクリプト
```
