import { Packet, UDPPacket } from 'modloader64_api/ModLoaderDefaultImpls';
import * as PData from '../puppet/Instance';

export class SyncStorage extends Packet {
    game_flags: Buffer;
    jiggy_flags: Buffer;
    honeycomb_flags: Buffer;
    mumbo_token_flags: Buffer;
    note_totals: Buffer;
    jigsaws_completed: Buffer;
    level_data: any;
    level_events: number;
    moves: number;
    constructor(
        lobby: string,
        game_flags: Buffer,
        honeycomb_flags: Buffer,
        jiggy_flags: Buffer,
        mumbo_token_flags: Buffer,
        note_totals: Buffer,
        jigsaws_completed: Buffer,
        level_data: any,
        level_events: number,
        moves: number
    ) {
        super('SyncStorage', 'BkOnline', lobby, false);
        this.game_flags = game_flags;
        this.honeycomb_flags = honeycomb_flags;
        this.jiggy_flags = jiggy_flags;
        this.mumbo_token_flags = mumbo_token_flags;
        this.note_totals = note_totals;
        this.jigsaws_completed = jigsaws_completed;
        this.level_data = level_data;
        this.level_events = level_events;
        this.moves = moves;
    }
}

export class SyncBuffered extends Packet {
    value: Buffer;
    constructor(lobby: string, header: string, value: Buffer, persist: boolean) {
        super(header, 'BkOnline', lobby, persist);
        this.value = value;
    }
}

export class SyncNumbered extends Packet {
    value: number;
    constructor(lobby: string, header: string, value: number, persist: boolean) {
        super(header, 'BkOnline', lobby, persist);
        this.value = value;
    }
}

// #################################################
// ##  Puppet Tracking
// #################################################

export class SyncPuppet extends UDPPacket {
    puppet: PData.Data;
    constructor(lobby: string, value: PData.Data) {
        super('SyncPuppet', 'BkOnline', lobby, false);
        this.puppet = value;
    }
}

export class SyncLocation extends Packet {
    level: number;
    scene: number;
    constructor(lobby: string, level: number, scene: number) {
        super('SyncLocation', 'BkOnline', lobby, true);
        this.level = level;
        this.scene = scene;
    }
}

// #################################################
// ##  Level Tracking
// #################################################

export class SyncLevelNumbered extends Packet {
    level: number;
    value: number;
    constructor(
        lobby: string,
        header: string,
        level: number,
        value: number,
        persist: boolean
    ) {
        super(header, 'BkOnline', lobby, persist);
        this.level = level;
        this.value = value;
    }
}

// #################################################
// ##  Scene Tracking
// #################################################

export class SyncSceneNumbered extends Packet {
    level: number;
    scene: number;
    value: number;
    constructor(
        lobby: string,
        header: string,
        level: number,
        scene: number,
        value: number,
        persist: boolean
    ) {
        super(header, 'BkOnline', lobby, persist);
        this.level = level;
        this.scene = scene;
        this.value = value;
    }
}

export class SyncVoxelNotes extends Packet {
    level: number;
    scene: number;
    notes: number[];
    constructor(
        lobby: string,
        level: number,
        scene: number,
        notes: number[],
        persist: boolean
    ) {
        super('SyncVoxelNotes', 'BkOnline', lobby, persist);
        this.level = level;
        this.scene = scene;
        this.notes = notes;
    }
}