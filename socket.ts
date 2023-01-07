import { webActions } from './webActions'
import { IExtendedWebSocket, IExtendedRawData } from 'interfaces'
const webs = new webActions()
import WebSocketServer from 'ws'

// WebSocket-сервер на порту 8081
const webServer = new WebSocketServer.Server({
  port: 8081
})
webServer.on('connection', (ws: IExtendedWebSocket) => {
  webs.addClient(ws)

  ws.on('message', (message: IExtendedRawData) => {
    console.log('получено сообщение', message, ws.clientName)
    const chunks = message.split(':')
    const action = chunks[0]
    const range = chunks[1]
    const isResponse = !!chunks[2]
    let response
    console.log(webs.activeInteractions)
    switch (action) {
      case webs.actType.vSlash.name:
        const isInRange1 = webs.calcRange(range, webs.actType.vSlash.rangeX)
        console.log('isResponse', isResponse)
        if (isResponse) {
          webs.setupResult(isInRange1)
        } else {
          response = webs.setMessage([webs.actType.vSlash.name])
          webs.sendToAll(response)
        }
        break

      case webs.actType.range.name:
        const isInRange2 = webs.calcRange(range, webs.actType.vSlash.rangeX)
        response = webs.setMessage([webs.actType.result.name, isInRange2])
        console.log('isInRange2', isInRange2)
        webs.sendToAll(response)
        break

      case webs.actType.moveForward.name:
        response = webs.actType.moveForward.name
        webs.sendToOpponent(ws.clientName, response)

      case webs.actType.moveStop.name:
        response = webs.actType.moveStop.name
        webs.sendToOpponent(ws.clientName, response)
    }
  })

  ws.on('close', () => {
    webs.closeConnection(ws)
  })
})
