import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
export declare class CommentService {
    private commentModel;
    constructor(commentModel: Model<CommentDocument>);
    create(createDto: CreateCommentDto): Promise<Comment>;
    findAll(): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    update(id: string, authorId: string, updateDto: UpdateCommentDto): Promise<Comment>;
    remove(id: string, authorId: string): Promise<void>;
}
