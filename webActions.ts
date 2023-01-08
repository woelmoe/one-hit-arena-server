import { EventEmitter } from 'node:events'
import { IExtendedWebSocket, WebActions } from './interfaces'

export class webActions extends EventEmitter {
  clients = {}
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
    moveStop: {
      name: WebActions.stopMove
    },
    moveForward: {
      name: WebActions.moveForward
    },
    moveBack: {
      name: WebActions.moveBack
    }
  }

  addClient(client: IExtendedWebSocket) {
    const id = Date.now()
    this.clients[id] = client
    this.clients[id]._id = id
    console.log('подключен пользователь ' + this.clients[id]._id)
  }
  calcRange(range: string, targetX: number) {
    return +range <= targetX
  }
  setMessage(chunks: any[]) {
    return chunks.join(':')
  }
  sendToOpponent(clientWS: IExtendedWebSocket, message: string) {
    Object.entries(this.clients).forEach(
      (item: [string, IExtendedWebSocket]) => {
        if (item[1]._id !== clientWS._id) {
          item[1].send(message)
        }
      }
    )
  }
  sendToAll(message: string) {
    Object.entries(this.clients).forEach(
      (item: [string, IExtendedWebSocket]) => {
        item[1].send(message)
      }
    )
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
    delete this.clients[ws._id]
    console.log('соединение закрыто ' + ws._id)
    this.clearData()
  }
}
