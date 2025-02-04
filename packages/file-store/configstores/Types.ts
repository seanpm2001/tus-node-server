import {Upload} from '@tus/server'

export interface Configstore {
  get(key: string): Promise<Upload | undefined>
  set(key: string, value: Upload): Promise<void>
  delete(key: string): Promise<void>

  list?(): Promise<Array<string>>
}
