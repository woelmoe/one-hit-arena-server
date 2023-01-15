import { EventEmitter } from 'node:events'
import { IExtendedWebSocket, WebActions, ClientSide } from './interfaces'

export class webActions extends EventEmitter {
  clients = {
    right: null,
    left: null
  }
  activeInteractions = []

  actType = {
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
      name: WebActions.result,
      attacker: 'a',
      defender: 'd'
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

  handleClientSideAuth(side: ClientSide, client: IExtendedWebSocket): boolean {
    let result = false
    console.log('side:', side)
    switch (side) {
      case ClientSide.leftSide:
        if (this.clients.left === null) {
          this.clients.left = client
          this.clients.left.id = ClientSide.leftSide
          result = true
          console.log('подключен пользователь ' + this.clients.left.id)
        }
        break
      case ClientSide.rightSide:
        if (this.clients.right === null) {
          this.clients.right = client
          this.clients.right.id = ClientSide.rightSide
          result = true
          console.log('подключен пользователь ' + this.clients.right.id)
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
  sendToOpponent(clientWS: IExtendedWebSocket, message: string) {
    if (clientWS.clientSide === ClientSide.leftSide)
      this.clients.right.send(message)
    else this.clients.left.send(message)
  }
  sendToAll(message: string) {
    if (this.clients.left) this.clients.left.send(message)
    if (this.clients.right) this.clients.right.send(message)
  }
  setupResult(isSuccess: boolean) {
    const calcInteractions = () => {
      let message = ''
      if (this.activeInteractions[0] && this.activeInteractions[1]) {
        message = this.setMessage([
          this.actType.vSlash.name,
          null,
          null,
          this.actType.result.name,
          true
        ])
      } else {
        message = this.setMessage([
          this.actType.vSlash.name,
          null,
          null,
          this.actType.result.name,
          false
        ])
      }
      return message
    }
    console.log(this.activeInteractions.length)
    this.activeInteractions.push(isSuccess)
    if (this.activeInteractions.length < 2) {
      return
    } else {
      this.sendToAll(calcInteractions())
      this.activeInteractions.length = 0
    }
  }
  clearData() {
    this.activeInteractions.length = 0
  }
  closeConnection(ws: IExtendedWebSocket) {
    if (ws.clientSide === ClientSide.leftSide) this.clients.left = null
    else this.clients.right = null
    console.log('соединение закрыто ' + ws)
    this.clearData()
  }
}
