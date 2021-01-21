//モジュール読み込み
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const config = require('config')
let users = {};

//静的ファイル有効
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

logout = (socket) => {
}

fetchUser = (socket) => {
    if (!users) return;
    return users[socket.id];
}

generateToken = () => {
    let token = Math.random().toString(32).substring(2);
    return token;
}

//connection イベント
io.on('connection', (socket) => {
    //socket.id の確認

    // client から server のメッセージ
    socket.on('client_to_server', (data) => {
    })

    //ログイン処理
    socket.on('login', (user) => {
        //user.isConnect = true なら終了

        //トークン発行

        //Socket ID をキーに user を users 配列に登録

        //data の作成

        //送信元の「logined」に、データ送信 emit()

        //送信元以外全てのクライアントの「user_joined」にデータ送信（ブロードキャスト）
    });

    //スタンプ送受信
    socket.on('sendStamp', (data) => {
    });

    //ユーザ一覧
    socket.on('userList', () => {
        //送信元の show_users に users をデータ送信
    });

    //ログアウト
    socket.on('logout', () => {
        logout(socket);
    });
    
    //切断
    socket.on('disconnect', () => {
        console.log('disconnect');
        logout(socket);
    });

});

const port = config.server.port;
const host = config.server.host;
http.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`)
})