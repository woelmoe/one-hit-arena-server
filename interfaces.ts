import { WebSocket } from 'ws'

export interface IExtendedWebSocket extends WebSocket {
  clientName: string
  _id: string
}
export interface IExtendedRawData {
  split: Function
}

export enum WebActions {
  checkClient = 'checkClient',
  moveForward = 'moveF',
  moveBack = 'moveB',
  stopMove = 'moveStop',
  vSlash = 'vSlash',
  result = 'result',
  range = 'range',
  defend = 'defend',
  hBlock = 'hBlock',
  response = 'response'
}
