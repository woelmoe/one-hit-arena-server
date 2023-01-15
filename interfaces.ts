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
