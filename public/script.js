// const { text } = require("express");

const socket = io('/');
//create a new peer object on the frontend
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
});


//dom manipulation
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
myVideo.muted = false;

let myVideoStream;
//create a function to render the source video and various streams
const addVideoStream = (video,stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}

//create a video stream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => { 
    myVideoStream = stream
    addVideoStream(myVideo,stream)


   //answer a corresponding stream from the root user
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream)
        }),function(err) {
            console.log('Failed to get local stream' ,err);
          }
    })

    //integrate the video stream with socket.io
    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId,stream)
    })
        let text = $('input')
    console.log(text)



    $('html').keydown((e) =>{
        if (e.which === 13 && text.val().length !== 0){
            console.log(text)
            socket.emit('message', text.val())
            text.val('')
        }
    })



    //respond to the corresponding message from the server

    socket.on('createMessage', message =>{
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToButton()
    })
    
})

//render client side rtc
peer.on('open', (id)=>{
    socket.emit('join-room', ROOM_ID, id)
})

 //connect a user video stream with your stream
 const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
    //call the peer stream for rtc
}

const scrollToButton = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}


//mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled
    if (enabled){
        myVideoStream.getAudioTracks()[0].enabled = false
        setUnmuteButton();
    } else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true
    }
}

const setMuteButton = () => {
    const html = `<i class ="fas fa-microphone"></i>
    <span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnMuteButton = () => {
    const html = `<i class="fas fa-microphone-slash"></i>
    <span>UnMute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}

//the stop video functionality
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    if (enabled){
        myVideoStream.getVideoTracks()[0].enabled = false
        setPlayVideo()
    }else{
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true
        
    }
}


const setStopVideo = () =>{
    const html = `<i class ="fas fa-video"></i>
    <span>Stop Video</span>`

    document.querySelector('.main__video_button').innerHTML = html
}

const setPlayVideo = () =>{
    const html =`<i class ="fas fa-video-slash"></i>
    <span>Play Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html

}