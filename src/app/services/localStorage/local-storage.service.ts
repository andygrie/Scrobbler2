import { Inject, Injectable } from "@angular/core";
import { SESSION_STORAGE, StorageService } from "angular-webstorage-service";

@Injectable()
export class LocalStorageService {
  anotherTodolist = [];
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {}
  public set(key: string, value: string): void {
    console.log(`set item: ${key}: ${value}`);
    this.storage.set(key, value);
  }
  public get(key: string): any {
    console.log(`get item ${key}: ${this.storage.get(key)}`);
    return this.storage.get(key);
  }
}
