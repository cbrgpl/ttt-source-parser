/**
 * IEntity<T> и IKeyword определены в первую очередь, чтобы проще было понимать архитектуру.
 * В дальнейшем, возможно, понадобятся доп. поля в этих сигнатурах.
 */
export interface IEntity<T> {
  value: T;
}

export interface IKeyword {
  value: string;
}

export enum EOperationStatus {
  SUCCESS = '__SUCCESS',
  ERROR = '__ERROR',
  UNEXPECTED_BEHAVIOR = '__UNEXPECTED_BEHAVIOR',
  BE_SILENT = '__BE_SILENT'
}

export abstract class AKeywordManpulator<T extends object> {
  protected _entities: IEntity<T>[]

  abstract get(): Promise<IKeyword[]>;
  abstract create( keyword: IKeyword ): Promise<EOperationStatus>;
  abstract delete( keyword: IKeyword ): Promise<EOperationStatus>;

  // null means function is not used to define if keyword exists
  abstract isKeywordExist( keyword: IKeyword ): boolean | null
}
