import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomMemberEntity } from './chat-room-member.entity';
import { Not, Repository } from 'typeorm';
import { AddMemberDto } from './chat-room-member.dto';
import { UserEntity } from 'src/modules/user';
import { AccountStatusEnum } from 'src/common/enums';
import { ChatRoomEntity } from 'src/modules/chat/chat-room/chat-room.entity';

@Injectable()
export class ChatRoomMemberService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(ChatRoomEntity)
        private readonly chatRoomRepo: Repository<ChatRoomEntity>,
        @InjectRepository(ChatRoomMemberEntity)
        private readonly chatRoomMemberRepo: Repository<ChatRoomMemberEntity>,
    ) {}

    async addMember(creatorId: string, dto: AddMemberDto) {
        const chatRoom = await this.chatRoomRepo.findOne({
            where: { id: dto.chatRoomId, creatorId },
        });
        if (!chatRoom) {
            throw new HttpException(
                'You cannot perform this action on this room',
                HttpStatus.FORBIDDEN,
            );
        }

        const user = await this.userRepo.findOne({
            where: {
                id: dto.userId,
                accountStatus: Not(AccountStatusEnum.DELETED),
            },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        let member = await this.chatRoomMemberRepo.findOne({
            where: { chatRoomId: dto.chatRoomId, userId: dto.userId },
        });
        if (member) {
            throw new HttpException('Already a member', HttpStatus.CONFLICT);
        }

        member = this.chatRoomMemberRepo.create({
            chatRoomId: dto.chatRoomId,
            userId: dto.userId,
        });
        return await this.chatRoomMemberRepo.save(member);
    }

    async getMemberUser(chatRoomId: string, userId: string) {
        return await this.chatRoomMemberRepo.findOne({
            where: { chatRoomId, userId },
        });
    }

    async removeMember() {}
}
