# ForgeCAD 太陽系モデル

このプロジェクトは、ForgeCAD 用の太陽系モデルと、ブラウザで操作できる 3D ビューアーを含みます。天体の半径は実データをもとに太陽半径との比率で計算しているため、天体同士のサイズ比率は固定されています。

## GitHub Pagesで公開する

`index.html` はGitHub Pages向けの単体HTMLです。GitHub Pagesを `main` ブランチの `/ (root)` で公開すると、トップURLで直接表示できます。

```text
https://ryotamatsuki.github.io/solar_system/
```

## ダブルクリックで起動する

`index.html` または `solar-system.html` をダブルクリックして開きます。どちらもブラウザだけで動く単体HTMLなので、開発サーバーは不要です。

画面左の矢印ボタンで視点を少しずつ回転できます。迷ったときは「初期位置」で全体表示に戻せます。太陽・惑星・準惑星をクリック、または右側の選択欄で選ぶと、その天体へズームし、右パネルに簡単な解説と参考文献が表示されます。

コードを変更したあとに公開用HTMLを作り直す場合は、次を実行します。`index.html` と `solar-system.html` が同時に生成されます。

```bash
npm run build:standalone
```

直接開ける状態になっているか確認する場合は、次を実行します。

```bash
npm run check:standalone
```

## 開発サーバーで確認する

開発中に自動更新しながら確認する場合は、次を実行します。

```bash
npm run dev -- --port 5173
```

表示された `http://127.0.0.1:5173/` をブラウザで開きます。

開発用の入口は `dev.html` です。必要に応じて次のURLを開いてください。

```text
http://127.0.0.1:5173/dev.html
```

## ForgeCAD モデル

ForgeCAD 側のモデルは `solar-system.forge.js` です。ForgeCAD Studio で開く場合は、ログイン済みの環境で次を実行します。

```bash
npx forgecad studio .
```

ForgeCAD CLI の実行には ForgeCAD アカウントまたは API トークンが必要です。
