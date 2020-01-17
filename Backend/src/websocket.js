const socketio = require('socket.io');
const parseStringasArray = require('./utils/parseStringasArray');
const calculateDistance = require('./utils/calculateDistance');

const connections = [];
exports.setupWebSocket = (server)=>{
    console.log('ok')
    const io = socketio(server);
    io.on('connection',socket=>{
        console.log(socket.handshake.query);
       const {latitude,longitude,techs}= socket.handshake.query
        connections.push({
            id:socket.id,
            coordinates:{
                latitude:Number(latitude),
                longitude:Number(longitude)
            },
            techs:parseStringasArray(techs)
        })
    })
} ;

exports.findConnections =  (coords,techs) =>{
    return connections.filter(conn=>{
        return calculateDistance(coords,conn.coordinates) <100
        && conn.techs.some(item=>techs.includes(item)) 
    })
}