/* eslint-disable no-case-declarations */
import { WebActionsClass } from './webActions'
import {
  IExtendedWebSocket,
  IExtendedRawData,
  WebActions,
  ClientSide
} from './interfaces'
import WebSocketServer from 'ws'

const webs = new WebActionsClass()
// WebSocket-сервер на порту 8081
const webServer = new WebSocketServer.Server({
  port: 8081
})
webServer.on('connection', (ws: IExtendedWebSocket) => {
  ws.on('message', (message: IExtendedRawData) => {
    console.log('получено сообщение', message)
    console.log('сторона', ws.clientSide)

    const chunks = message.split(':')
    const action = chunks[0]
    const contextData = chunks[1]
    const isResponse = !!chunks[2]
    const coords = chunks[3]

    let response = ''
    let responseOpponent = ''

    switch (action) {
      /** auth */
      case WebActions.auth:
        const authStatus = webs.handleClientSideAuth(contextData, ws)
        console.log('isAuthed', authStatus)
        response = webs.setMessage([WebActions.auth, contextData, authStatus])
        ws.send(response)
        break

      /** vertical slash */
      case WebActions.vSlash:
        const isInRange1 = webs.calcRange(
          contextData,
          webs.actType.vSlash.rangeX
        )
        if (isResponse) {
          const result = webs.setupVSlashResult(isInRange1)
          webs.sendToAll(result)
        } else {
          response = webs.setMessage([WebActions.vSlash, null, ws.clientSide])
          responseOpponent = webs.setMessage([
            WebActions.vSlash,
            WebActions.opponent,
            ws.clientSide
          ])
          webs.sendToCurrent(ws, response)
          webs.sendToOpponent(ws.clientSide, responseOpponent)
        }
        break

      /** vertical slash stop */
      case WebActions.vSlashStop:
        webs.sendToOpponent(ws.clientSide, WebActions.vSlashStop)
        break

      /** move forward */
      case WebActions.moveF:
        webs.sendToOpponent(ws.clientSide, WebActions.moveF)
        break

      /** move back */
      case WebActions.moveB:
        webs.sendToOpponent(ws.clientSide, WebActions.moveB)
        break

      /** jump */
      case WebActions.jump:
        webs.sendToOpponent(ws.clientSide, WebActions.jump)
        break
      case WebActions.jumpEnd:
        webs.sendToOpponent(ws.clientSide, WebActions.jumpEnd)
        break

      /** idle */
      case WebActions.idle:
        webs.sendToOpponent(ws.clientSide, WebActions.idle)
        break

      /** handle range */
      case WebActions.range:
        const isInRange2 = webs.calcRange(
          contextData,
          webs.actType.vSlash.rangeX
        )
        response = webs.setMessage([WebActions.result, isInRange2])
        console.log('isInRange2', isInRange2)
        webs.sendToAll(response)
        break

      /** movement */
      case WebActions.coordX:
        response = webs.setMessage([WebActions.coordX, null, coords])
        webs.sendToOpponent(ws.clientSide, response)
        break
      case WebActions.coordY:
        response = webs.setMessage([WebActions.coordY, null, coords])
        webs.sendToOpponent(ws.clientSide, response)
        break
    }
  })

  ws.on('close', () => {
    webs.closeConnection(ws.clientSide)
  })
})
