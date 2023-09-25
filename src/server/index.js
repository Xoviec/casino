const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http')
let isBettable = true

const server = http.createServer();
server.listen(webSocketsServerPort)

console.log('listening on port 8000')


const wsServer = new webSocketServer({
    httpServer: server
})



const clients = {};


const getUniqueID = () =>{
    const s4 = () => Math.floor((1 + Math.random()) * 10000).toString(16).substring(1);
    return s4()+s4()+'-'+s4();
}

wsServer.on('request', function(request){
    const userId = getUniqueID();
    console.log((new Date()) + 'Received a new connection from origin'+ request.origin,'.')

    const connection = request.accept(null, request.origin);
    clients[userId] = connection
    console.log('connected:'+userId,'in',Object.getOwnPropertyNames(clients))

    const clientList = Object.getOwnPropertyNames(clients)

    const messageObject = { 
        type: 'setUserID',
        msg: userId
    };


    const betReadyMessageObject = {
        type: 'roulette-message-object',
        msg: 'Betowanie włączone',
        stage: 0
    }

    const betDisabledMessageObject = {
        type: 'roulette-message-object',
        msg: 'Betowanie wyłączone',
        stage: 1
    }

    const betResetMessageObject = {
        type: 'roulette-message-object',
        msg: 'Resetowanie...',
        stage: 2
    }


    
    //możliwość dodania beta, blokada, reset

    const betReady = () =>{
        isBettable = true
        console.log('xd')
        if (connection.connected) {
            connection.ping();
            for(let key in clients){
                if(key===userId){
                    clients[key].send(JSON.stringify(betReadyMessageObject))
                }
            }
        }
        setTimeout(betDisable, 10_000);

    }

    const betDisable = () =>{
        isBettable = false
        if (connection.connected) {
            connection.ping();
            for(let key in clients){
                if(key===userId){
                    clients[key].send(JSON.stringify(betDisabledMessageObject))
                }
            }
        }
        setTimeout(betReset, 5000);

    }

    const betReset = () =>{
        if (connection.connected) {
            connection.ping();
            for(let key in clients){
                if(key===userId){
                    clients[key].send(JSON.stringify(betResetMessageObject))
                }
            }
        }
        setTimeout(betReady, 5000);
    }

    const pingInterval = setInterval(function() {
        if (connection.connected) {
            connection.ping();
            for(let key in clients){
                if(key===userId){
                    clients[key].send(JSON.stringify(messageObject))
                }
            }
        } else {
            clearInterval(pingInterval);
        }
    }, 1000);


    betReady()

    connection.on('message', function(message){

        // const clientMessage = {
        //     data: message.utf8Data,
        //     userId: userId
        // }

        // console.log(clientMessage)

        // console.log('eee',message.utf8Data)
        // console.log('stringified',JSON.stringify(message))


        if (message.type==='utf8'){
            // console.log('wiadomosc:'+message.utf8Data);

            // console.log('user id:',userId)

            for(let key in clients){

                console.log(JSON.parse(message.utf8Data).type) // konkretny item z obiektu
                clients[key].sendUTF(message.utf8Data);
                // clients[key].send(JSON.stringify(clientMessage))
                
                // console.log('sent message to:', clients[key])
            }


    

        }
    })
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
})

