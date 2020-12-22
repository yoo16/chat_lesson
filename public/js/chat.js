//const url = 'http://localhost:3000';
const url = '';
const chatArea = $('#chatArea');
const loginArea = $('#loginArea');
const message = $('#message');
const myChatList = $('#myChatList');
const userList = $('#userList');
const inputName = $('#inputName');
const iconList = $('#iconList');
const stampList = $('#stampList');
const userName = $('.userName');
const userNumber = $('.userNumber');
const FADE_TIME = 500;
let user = {};
let users = {};

loginArea.hide();
chatArea.hide();
stampList.hide();

//初期設定
$(() => {
    imagePath = (fileName) => {
        let path = 'images/' + fileName;
        return path;
    }
    addMessage = (value) => {
        if (!value) return;
        let messageElement = $('<small>').addClass('text-muted').text(value);
        myChatList.prepend(messageElement);
    }
    updateUserList = () => {
        console.log(users);
        userList.html('');
        $.each(users, function (key, user) {
            let img = $('<img>').attr({ 'src': imagePath(user.icon), 'width': 16 });
            let li = $('<li>').addClass('list-group-item').append(img).append(user.name);
            userList.append(li);
        });
        updateUserNumber = () => {
            let number = Object.keys(users).length;
            if (!number) return;
            userNumber.text(number);
        }
        updateUserNumber();
    }
    createIcons = () => {
        const icons = [...Array(6).keys()].map(i => `${++i}.png`);
        icons.forEach((icon, index) => {
            index++;

            let id = 'icon_' + index;
            let label = $('<label>').attr({ 'for': id });

            let input = $('<input>').attr({
                'id': id,
                'name': 'icon',
                'type': 'radio',
                'value': icon,
            });
            if (index == 1) input.attr({ checked: 'checked' });
            label.append(input);

            let img = $('<img>').attr({ 'src': imagePath(icon), 'width': 26 });
            label.append(img);

            iconList.append(label);
        })
    }
    createStamps = () => {
        const stamps = [...Array(6).keys()].map(i => `stamp${++i}.png`);
        stamps.forEach((stamp, index) => {
            index++;
            let imageId = 'stamp_' + index;
            let a = $('<a>').attr({ 'stamp': imageId, 'class': 'sendStamp' });
            let img = $('<img>').attr({'id': imageId, 'src': imagePath(stamp), 'width': 100 });
            a.append(img);
            stampList.append(a);
        })
    }
    createChatMessage = (data) => {
        if (!user.token) return;
        console.log(data);
        const date_string = new Date(data.datetime).toLocaleString('ja-JP');

        let isToken = (data.user.token == user.token);
        let chatStyle = (isToken) ? 'p-3 balloon-right' : 'p-3 balloon-left';
        let dateStyle = (isToken) ? 'p-3 text-primary' : 'p-1 text-dark';
        let userStyle = (isToken) ? 'text-right' : 'text-left';
        let message = data.message.replace(/\r?\n/g, '<br>');
        let messageElement = $('<div>').addClass(chatStyle).html(message);
        let img = $('<img>').attr({ 'src': imagePath(data.user.icon), 'width': 20 });
        let userElement = $('<small>').addClass(dateStyle).append(img).append(data.user.name);
        let dateElement = $('<small>').addClass('text-dark').html(date_string);
        let headerElement = $('<p>').addClass(userStyle).append([userElement]);
        let footerElement = $('<div>').addClass('text-right').append(dateElement);
        let chatElement = $('<div>').hide().append([headerElement, messageElement, footerElement]);

        myChatList.prepend(chatElement);
        chatElement.fadeIn(FADE_TIME);
    }

    createIcons();
    createStamps();

    loginArea.fadeIn(FADE_TIME);

    //サーバー接続
    let socket = io.connect(url);

    //接続
    socket.on('connect', () => {
        //socket.id をログで確認
        console.log(socket.id);
    });

    //切断
    socket.on('disconnect', () => {
    });

    // server から client へメッセージ
    socket.on('server_to_client', (data) => {
        createChatMessage(data);
    });

    // login 受信（個別）
    socket.on('logined', (data) => {
        console.log('logined');
        if (data.user) {
            user = data.user;
            users = data.users;

            console.log(user);
            console.log(users);

            userName.text(user.name);
            updateUserList();
        }
    });

    // login 受信（ブロードキャスト）
    socket.on('user_joined', (data) => {
        console.log('user_joined');
        if (data.user && data.users) {
            let message = data.user.name + ' joined.';
            addMessage(message);

            users = data.users;
            updateUserList();
        }
    });

    // ログアウト受信（ブロードキャスト）
    socket.on('user_left', (data) => {
    });

    // スタンプ受信
    socket.on('loadStamp', (data) => {
    });

    // ユーザ一覧受信
    socket.on('show_users', (data) => {
    });

    // client からの server へメッセージ
    $('#send').on('click', () => {
    });

    // サーバーへ login
    $('#login').on('click', () => {
        user = {};
        if (inputName.val()) {
            loginArea.hide();
            chatArea.fadeIn(FADE_TIME);

            user.name = inputName.val();
            user.icon = $('input[name=icon]:checked').val();
            socket.emit('login', user);

            console.log(user);
        }
    });

    //スタンプメニュー切り替え
    $('.stamp').on('click', () => {
    });

    //スタンプ送信
    $('.sendStamp').on('click', (event) => {
    });

    //ログアウト
    $('#logout').on('click', () => {
    });

    //ユーザ一覧表示処理
    $('#users').click(() => {
    });

})
