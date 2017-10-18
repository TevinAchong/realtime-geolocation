'use strict'

const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const locationMap = new Map()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send('Hello World')
})

io.on('connection', socket => {
    socket.on('registerTracker', () => {
        locationMap.set(socket.id, { lat : null, lng : null})
    })
    
    socket.on('updateLocation', pos => {
        if (locationMap.has(socket.id)) {
            locationMap.set(socket.id, pos)
            console.log(socket.id,  pos)
        }
    })

    socket.on('requestLocations', () => {
        socket.emit('locationsUpdate', Array.from(locationMap))
    })

    socket.on('disconnect', () => {
        locationMap.delete(socket.id)
    })
})

server.listen(3000, err => {
    if (err) {
        throw err
    }
    else {
        console.log('Server Started on port 3000')
    }
})

