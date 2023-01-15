import { webActions } from './webActions'
import {
  IExtendedWebSocket,
  IExtendedRawData,
  WebActions,
  ClientSide
} from './interfaces'
const webs = new webActions()
import WebSocketServer from 'ws'

// WebSocket-сервер на порту 8081
const webServer = new WebSocketServer.Server({
  port: 8081
})
webServer.on('connection', (ws: IExtendedWebSocket) => {
  ws.on('message', (message: IExtendedRawData) => {
    console.log('получено сообщение', message)

    const chunks = message.split(':')
    const action = chunks[0]
    const contextData = chunks[1]
    const isResponse = !!chunks[2]
    const coords = chunks[3]

    let response = ''
    switch (action) {
      case WebActions.auth:
        const isAuthed = webs.handleClientSideAuth(contextData, ws)
        response = webs.setMessage([WebActions.auth, contextData, isAuthed])
        webs.sendToAll(response)
        break

      case WebActions.vSlash:
        const isInRange1 = webs.calcRange(
          contextData,
          webs.actType.vSlash.rangeX
        )
        console.log('isResponse', isResponse)
        if (isResponse) {
          webs.setupResult(isInRange1)
        } else {
          response = webs.setMessage([WebActions.vSlash])
          webs.sendToAll(response)
        }
        break

      case WebActions.range:
        const isInRange2 = webs.calcRange(
          contextData,
          webs.actType.vSlash.rangeX
        )
        response = webs.setMessage([WebActions.result, isInRange2])
        console.log('isInRange2', isInRange2)
        webs.sendToAll(response)
        break

      case WebActions.coordX:
        response = webs.setMessage([WebActions.coordX, null, null, coords])
        webs.sendToOpponent(ws, response)
        break
      case WebActions.coordY:
        response = webs.setMessage([WebActions.coordY, null, null, coords])
        webs.sendToOpponent(ws, response)
        break
    }
  })

  ws.on('close', () => {
    webs.closeConnection(ws)
  })
})
