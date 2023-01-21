import { WebSocket } from 'ws'

export interface IExtendedRawData {
  split: Function
}

export enum ClientSide {
  rightSide = 'rightSide',
  leftSide = 'leftSide'
}
export enum WebActions {
  auth = 'auth',
  checkClient = 'checkClient',
  coordX = 'x',
  coordY = 'y',
  vSlash = 'vSlash',
  result = 'result',
  range = 'range',
  defend = 'defend',
  hBlock = 'hBlock',
  response = 'response'
}
export interface IExtendedWebSocket extends WebSocket {
  clientSide: ClientSide
}

export interface IActType {
  checkClient: {
    name: WebActions
  }
  vSlash: {
    name: WebActions
    rangeX: number
  }
  range: {
    name: WebActions
  }
  result: {
    name: WebActions
  }
  defend: {
    name: WebActions
  }
  coordX: {
    name: WebActions
  }
  coordY: {
    name: WebActions
  }
}

export interface IClients {
  right: IExtendedWebSocket | null,
  left: IExtendedWebSocket | null
}

export enum AuthResponse {
  granted = 'granted',
  denied = 'denied'
}