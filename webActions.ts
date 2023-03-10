import { EventEmitter } from 'node:events'
import {
  IExtendedWebSocket,
  WebActions,
  ClientSide,
  IClients,
  IActType,
  AuthResponse
} from './interfaces'

export class WebActionsClass extends EventEmitter {
  clients: IClients = {
    right: null,
    left: null
  }
  activeInteractions = []

  actType: IActType = {
    checkClient: {
      name: WebActions.checkClient
    },
    vSlash: {
      name: WebActions.vSlash,
      rangeX: 241.342
    },
    range: {
      name: WebActions.range
    },
    result: {
      name: WebActions.result
    },
    defend: {
      name: WebActions.defend
    },
    coordX: {
      name: WebActions.coordX
    },
    coordY: {
      name: WebActions.coordY
    }
  }

  handleClientSideAuth(side: ClientSide, ws: IExtendedWebSocket): AuthResponse {
    let result = AuthResponse.denied
    switch (side) {
      case ClientSide.leftSide:
        if (this.clients.left === null) {
          ws.clientSide = ClientSide.leftSide
          this.clients.left = ws
          result = AuthResponse.granted
          console.log('подключен пользователь ' + side)
        }
        break
      case ClientSide.rightSide:
        if (this.clients.right === null) {
          ws.clientSide = ClientSide.rightSide
          this.clients.right = ws
          result = AuthResponse.granted
          console.log('подключен пользователь ' + side)
        }
        break

      default:
        console.log('unknown result')
        break
    }
    return result
  }
  calcRange(range: string, targetX: number) {
    return +range <= targetX
  }
  setMessage(chunks: any[]) {
    return chunks.join(':')
  }
  sendToCurrent(ws: IExtendedWebSocket, message: string) {
    ws.send(message)
  }
  sendToOpponent(side: ClientSide, message: string) {
    if (side === ClientSide.leftSide) this.sendToRight(message)
    else this.sendToLeft(message)
  }
  sendToLeft(message: string) {
    if (this.clients.left) this.clients.left.send(message)
  }
  sendToRight(message: string) {
    if (this.clients.right && this.clients.right)
      this.clients.right.send(message)
  }
  sendToAll(message: string) {
    if (this.clients.left) this.clients.left.send(message)
    if (this.clients.right) this.clients.right.send(message)
  }
  setupActiveInteractions(isSuccess: boolean) {
    this.activeInteractions.push(isSuccess)
  }
  setupVSlashResult(): string {
    let message = ''
    if (this.activeInteractions[0] && this.activeInteractions[1]) {
      message = this.setMessage([
        this.actType.vSlash.name,
        this.actType.result.name,
        true
      ])
    } else {
      message = this.setMessage([
        this.actType.vSlash.name,
        this.actType.result.name,
        false
      ])
    }
    if (this.activeInteractions.length > 1) this.activeInteractions.length = 0
    return message
  }
  clearData() {
    this.activeInteractions.length = 0
  }
  closeConnection(side: ClientSide) {
    console.log('соединение закрыто ' + side)
    if (side === ClientSide.leftSide) {
      this.clients.left = null
    } else this.clients.right = null
    this.clearData()
  }
}
