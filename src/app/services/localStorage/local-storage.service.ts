import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

@Injectable()
export class LocalStorageService {
  anotherTodolist = [];
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}
  public set(key: string, value: string): void {
    this.storage.set(key, value);
  }
  public get(key: string): any {
    return this.storage.get(key);
  }
}
