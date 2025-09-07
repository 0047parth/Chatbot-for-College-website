class Chatbox{
    constructor(){
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.message = [];
    }

    display(){
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input')
        node.addEventListener("keyup", ({key}) =>{

            if(key === "Enter")
            {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox){

        this.state = !this.state;

        if(this.state){
            chatbox.classList.add('chatbox--active')
        }
        else{
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox)
    {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "")
        {
            return;
        }

        let msg1 = {name:"user", message:text1}
        this.message.push(msg1);

        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({message: text1}),
            mode: 'cors',
            headers: {
                'content-Type': 'application/json'
            },

        })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name:"PVG", message: r.answer};
            this.message.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''
        }).catch((error) => {
            console.error('error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
    }

updateChatText(chatbox){
    var html = '';
    this.message.slice().reverse().forEach(function(item, index)
    {
        if(item.name === "PVG")
        {
            html += '<div class="messages__item message__item--visitor" style="border-radius: 16px 16px 16px 0px;">' + item.message + '</div>'
        }  
        else{
            html += '<div class="messages__item message__item--operator" style="align-self: flex-end;border-radius: 16px 16px 0px 16px; background: #790ddd; color: #FFFFFF">' + item.message + '</div>'
        } 
    });

    const chatmessage = chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;
}

}

const chatbox = new Chatbox();
chatbox.display();