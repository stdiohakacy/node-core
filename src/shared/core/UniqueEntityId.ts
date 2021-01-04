
import { Identifier } from './Identifier'
import * as uuid from 'uuid'

export class UniqueEntityId extends Identifier<string | number>{
  constructor (id?: string | number) {
    super(id ? id : uuid.v4())
  }
}