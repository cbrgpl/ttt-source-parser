# ttt-source-parser

Пакет предоставляет набор классов-утилит, чтобы создать программу парсер исходного кода для поиска ключевых слов при помощи регулярных выражений. Программа должна содержать реализацию манипулятора, который обеспечит взаимодействие с серверной частью для создания или удаления ключевых слов.

## Usage

```bash
npm i ttt-source-parser --save
```

Пример реализации скрипта для поиска подсказок в исходном коде.

**index.ts**
```ts
import {
  CI,
  conductorFactory,
  _setArgsToModule,
} from 'ttt-source-parser'

import { HintManipulator } from './core/HintManipulator.js'

;( async (): Promise<void> => {
  try {
    _setArgsToModule( 'env' )

    const manipulator = new HintManipulator()
    const conductor = await conductorFactory( manipulator )

    const promises = [
      conductor.createKeywords(),
      conductor.deleteUnusedKeywords(),
    ]

    await Promise.all( promises )

    CI.finish( 'Finish' )
    process.exit( 0 )
  } catch ( err ) {
    // ...
    process.exit( 1 )
  }
} )()
```

**./core/HintManipulator.ts**
```ts
import {
  type IKeyword,
  type IEntity,
  EOperationStatus,

  AKeywordManpulator,
} from 'ttt-source-parser'

import { fetchWrapper } from '../helpers/fetchWrapper.js'
import { API_URL } from '@/static/consts.js'

interface IHint {
  id: number;
  name: string;
}

export class HintManipulator extends AKeywordManpulator<IHint> {
  protected _entities = [] as IEntity<IHint>[]

  async get() {
    const response = await fetchWrapper( API_URL + '/hints/' )

    this._entities = await response.json()

    return this._entities.map( entity => ( { value: entity.value.id } ) )
  }

  async create( keyword: IKeyword ) {
    const hint = {
      name: keyword.value,
    }

    const response = await fetchWrapper( API_URL + '/hints/', {
      method: 'POST',
      body: JSON.stringify( hint ),
    } )

    return EOperationStatus.SUCCESS
  }

  async delete( keyword: IKeyword ) {
    const hint = this._entities.find( entity => entity.value.id === keyword.value )

    const response = await fetchWrapper( API_URL + `/hints/${ hint!.value.id }/`, { method: 'DELETE'} )

    return EOperationStatus.SUCCESS
  }
}

```

## Архитектура

![Диаграмма классов](./documentation/source_parser_arch.svg)
