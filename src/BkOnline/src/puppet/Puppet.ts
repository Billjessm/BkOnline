import { CMD, CommandBuffer } from './Controller';
import { INetworkPlayer } from 'modloader64_api/NetworkHandler';
import IMemory from 'modloader64_api/IMemory';
import uuid from 'uuid';
import * as API from 'modloader64_api/BK/Imports';
import * as PData from './Instance';

export class Puppet extends API.BaseObj {
  commandBuffer: CommandBuffer;
  nplayer: INetworkPlayer;
  data: PData.Data;
  id: string;
  scene: API.SceneType;
  index: number;
  pointer: number;
  canHandle = false;
  isSpawned = false;

  log(msg: string) {
    console.info('info:    [Puppet] ' + msg);
  }

  constructor(
    emu: IMemory,
    commandBuffer: CommandBuffer,
    pointer: number,
    player: API.IPlayer,
    nplayer: INetworkPlayer,
    index: number
  ) {
    super(emu);
    this.data = new PData.Data(emu, pointer, player);
    this.commandBuffer = commandBuffer;
    this.nplayer = nplayer;
    this.id = uuid.v4();
    this.scene = API.SceneType.UNKNOWN;
    this.index = index;
    this.pointer = pointer;
  }

  handleInstance(data: PData.IData) {
    if (!this.isSpawned || !this.canHandle) return;
    if (this.data.broken) return;
    Object.keys(data).forEach((key: string) => {
      (this.data as any)[key] = (data as any)[key];
    });

    // Broken puppet check
    if (this.data.broken) this.despawn('broke check');
  }

  spawn() {
    let ptr = this.emulator.dereferencePointer(this.pointer);
    this.isSpawned = (ptr !== 0x000000);
    this.canHandle = false;
    
    this.log('Spawn Called ' + ptr);
    if (this.isSpawned) {
      this.canHandle = true;
      return;
    }

    this.commandBuffer.runCommand(
      CMD.SPAWN,
      this.index,
      (ptr: number) => {
        if (ptr === 0x000000) {
          this.log('Spawn Failed');
          return;
        }

        let DEADBEEF: Buffer = Buffer.from('DEADBEEF', 'hex');
        this.emulator.rdramWriteBuffer(ptr + 0x1c, DEADBEEF);
        this.isSpawned = true;
        this.canHandle = true;
        this.log('Puppet spawned! ' + ptr.toString(16).toUpperCase());
      }
    );
  }

  despawn(caller: string) {
    let ptr = this.emulator.dereferencePointer(this.pointer);
    this.isSpawned = (ptr !== 0x000000);
    this.canHandle = false;

    this.log('Despawn Called: ' + caller + ptr);
    if (!this.isSpawned) return;

    this.commandBuffer.runCommand(
      CMD.DESPAWN,
      this.index,
      (ptr: number) => {
        if (ptr !== 0x000000) {
          this.log('Despawn Failed');
          return;
        }

        this.isSpawned = false;
        this.data.broken = false;
        this.log('Puppet ' + this.id + ' despawned.');
      }
    );
  }
}