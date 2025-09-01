import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schemas/comment.schema';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(createDto: CreateCommentDto): Promise<Comment>;
    findAll(): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    update(id: string, authorId: string, updateDto: UpdateCommentDto): Promise<Comment>;
    remove(id: string, authorId: string): Promise<void>;
}
