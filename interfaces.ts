import { WebSocket, RawData } from 'ws'

export interface IExtendedWebSocket extends WebSocket {
  clientName: string,
  _id: string
}
export interface IExtendedRawData {
  split: Function
}
