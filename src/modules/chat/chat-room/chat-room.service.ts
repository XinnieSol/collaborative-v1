import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomEntity } from './chat-room.entity';
import { Repository } from 'typeorm';
import { CreateChatRoomDto } from './chat-room.dto';
import { ChatRoomMemberEntity } from 'src/modules/chat/chat-room/chat-room-member/chat-room-member.entity';

@Injectable()
export class ChatRoomService {
    constructor(
        @InjectRepository(ChatRoomEntity)
        private readonly chatRoomRepo: Repository<ChatRoomEntity>,
        @InjectRepository(ChatRoomMemberEntity)
        private readonly chatRoomMemberRepo: Repository<ChatRoomMemberEntity>,
    ) {}

    async create(creatorId: string, dto: CreateChatRoomDto) {
        let room = await this.chatRoomRepo.findOne({
            where: { creatorId, name: dto.name },
        });
        if (room) {
            throw new HttpException(
                `Room with name ${dto.name} already exists. Please use a differnt name`,
                HttpStatus.CONFLICT,
            );
        }

        room = this.chatRoomRepo.create({
            creatorId,
            name: dto.name,
        });

        room = await this.chatRoomRepo.save(room);

        // creator becomes member
        const member = this.chatRoomMemberRepo.create({
            chatRoomId: room.id,
            userId: creatorId,
        });
        await this.chatRoomMemberRepo.save(member);

        return room;

        // connect to gateway
    }

    async get(chatRoomId: string) {
        return this.chatRoomRepo.findOne({ where: { id: chatRoomId } });
    }
}
