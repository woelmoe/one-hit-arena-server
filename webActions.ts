import { EventEmitter } from 'node:events'
import { IExtendedWebSocket } from 'interfaces'

export class webActions extends EventEmitter {
  clients = {}
  activeInteractions = []

  actType = {
    checkClient: {
      name: 'checkClient'
    },
    vSlash: {
      name: 'vSlash',
      rangeX: 241.342
    },
    range: {
      name: 'range'
    },
    result: {
      name: 'result',
      attacker: 'a',
      defender: 'd'
    },
    defend: {
      name: 'defend'
    },
    moveStop: {
      name: 'moveStop'
    },
    moveForward: {
      name: 'moveF'
    },
    moveBack: {
      name: 'moveB'
    }
  }

  addClient(client: IExtendedWebSocket) {
    const id = Date.now()
    this.clients[id] = client
  }
  calcRange(range: string, targetX: number) {
    return +range <= targetX
  }
  setMessage(chunks: any[]) {
    return chunks.join(':')
  }
  sendToOpponent(nameFrom: string, message: string) {
    console.log('nameFrom', nameFrom)
    // if (nameFrom === this.clients.leftSide.name) this.sendToRight(message)
    // else this.sendToLeft(message)
  }
  sendToAll(message: string) {
    Object.entries(this.clients).forEach(
      (item: [string, IExtendedWebSocket]) => {
        console.log(item[1])
        item[1].send(message)
      }
    )
  }
  setupResult(isSuccess: boolean) {
    const calcInteractions = () => {
      let message
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
    console.log('соединение закрыто ' + ws.clientName)
    this.clearData()
  }
}
