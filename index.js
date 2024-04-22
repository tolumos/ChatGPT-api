let message_list = JSON.parse(localStorage.getItem('message_list'));
if (message_list === null) {
    message_list = [];
}
function sendData() {
    var userInput = document.querySelector(".input_size").value;
    console.log("User input: " + userInput);

    // 您的OpenAI API密钥
    const apiKey = 'API-KEY';

    // 设置请求头部，包括您的API密钥
    const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
    };

    message_list.push({'role': 'user', 'content': userInput})
    //渲染用户输入
    let div_user = document.createElement('div');
    div_user.textContent = JSON.stringify(userInput);
    div_user.style.textAlign = 'right';
    document.body.appendChild(div_user);

    // 设置请求体，包括模型和其他参数
    const data = {
    model: "gpt-3.5-turbo",
    messages: message_list,
    max_tokens: 1500,
    temperature: 1
    };

    axios.post('PROXY-URL', data, { headers: headers })
        .then(response => {
            console.log(response.data);
            let div = document.createElement('div');
            div.innerHTML = '用户' + JSON.stringify(userInput) + '<br>' + 'AI' + JSON.stringify(response.data.choices[0].message.content);
            message_list.push({'role': 'assistant', 'content': response.data.choices[0].message.content})
            let contentElement = document.querySelector('.reword');
            contentElement.appendChild(div);
            localStorage.setItem('message_list', JSON.stringify(message_list));
        })
        .catch(error => {
            console.error(error);
        });
    document.getElementById("inputField").value = ''
    }
    // 发送POST请求到OpenAI API
    var button = document.querySelector('.send_button');
    button.addEventListener('click', sendData);
    document.getElementById('inputField').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            sendData()
        }
    });

    let message_list_now = JSON.parse(localStorage.getItem('message_list'));
    for (let i = 0; i < message_list_now.length; i += 2) {
        let element1 = message_list_now[i];
        let element2 = message_list_now[i + 1];
        let div = document.createElement('div');
        div.style.maxWidth = document.querySelector('.reword').style.width;
        div.style.wordWrap = 'break-word';
        div.innerHTML = '用户' + element1.content + '<br>' + 'AI' + element2.content;
        document.querySelector('.reword').appendChild(div);
        console.log(element1.content, element2.content);
    }