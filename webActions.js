const EventEmitter = require('events')
module.exports = class webActions extends EventEmitter {
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

  addClient(client) {
    const id = Date.now()
    this.clients[id] = client
  }
  getOpponentClientID(id) {
    return id === Object.entries(this.clients)[0]
  }
  calcRange(range, targetX) {
    return +range <= targetX
  }
  setMessage(chunks) {
    return chunks.join(':')
  }
  sendToOpponent(nameFrom, message) {
    console.log('nameFrom', nameFrom)
    // if (nameFrom === this.clients.leftSide.name) this.sendToRight(message)
    // else this.sendToLeft(message)
  }
  sendToAll(message) {
    Object.entries(this.clients).forEach((item) => {
      console.log(item[1])
      item[1].send(message)
    })
  }
  setupResult(isSuccess) {
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
  closeConnection(ws) {
    delete this.clients[ws._id]
    console.log('соединение закрыто ' + ws.clientName)
    this.clearData()
  }
}
