import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, SortOrder } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FindCommentsQueryDto } from './dto/find-comments.query.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createDto: CreateCommentDto): Promise<Comment> {
    try {
      const created = new this.commentModel(createDto);
      return await created.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error creating comment');
    }
  }

  private escapeRegex(input: string) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async findAll(query?: FindCommentsQueryDto): Promise<{
    data: Comment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const q = query || ({} as FindCommentsQueryDto);
      const filter: FilterQuery<CommentDocument> = {};

      if (q.assetId) filter.assetId = q.assetId;
      if (q.authorId) filter.authorId = q.authorId;
      if (q.userName)
        filter.userName = { $regex: this.escapeRegex(q.userName), $options: 'i' };
      if (q.text)
        filter.text = { $regex: this.escapeRegex(q.text), $options: 'i' };
      if (q.status) filter.status = q.status;

      if (q.createdFrom || q.createdTo) {
        filter.createdAt = {};
        if (q.createdFrom) filter.createdAt.$gte = new Date(q.createdFrom);
        if (q.createdTo) filter.createdAt.$lte = new Date(q.createdTo);
      }

      if (q.assetIds?.length) {
        filter.assetId = { $in: q.assetIds };
      }

      if (q.authorIds?.length) {
        filter.authorId = { $in: q.authorIds };
      }

      if (q.q) {
        const r = { $regex: this.escapeRegex(q.q), $options: 'i' };
        filter.$or = [
          { userName: r },
          { text: r },
        ];
      }

      const page = Math.max(1, q.page || 1);
      const limit = Math.min(100, Math.max(1, q.limit || 20));
      const skip = (page - 1) * limit;

      let sort: Record<string, SortOrder> = { createdAt: -1 };
      if (q.sort) {
        sort = {};
        const sortFields = q.sort.split(',');
        for (const field of sortFields) {
          const trimmed = field.trim();
          if (trimmed.startsWith('-')) {
            sort[trimmed.substring(1)] = -1;
          } else {
            sort[trimmed] = 1;
          }
        }
      }

      const [data, total] = await Promise.all([
        this.commentModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.commentModel.countDocuments(filter).exec(),
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching comments');
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const entry = await this.commentModel.findOne({ id }).exec();
      if (!entry) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
      return entry;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching comment');
    }
  }

  async update(
    id: string,
    authorId: string,
    updateDto: UpdateCommentDto,
  ): Promise<Comment> {
    console.log('entro al update');
    try {
      const updated = await this.commentModel
        .findOneAndUpdate({ id, authorId }, updateDto, { new: true })
        .exec();
      console.log('Que hiz updata', updated);

      if (!updated) {
        throw new NotFoundException(
          `Comment with id ${id} not found or not authored by user ${authorId}`,
        );
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating comment');
    }
  }

  async remove(id: string, authorId: string): Promise<void> {
    try {
      const result = await this.commentModel
        .findOneAndDelete({ id, authorId })
        .exec();
      if (!result) {
        throw new NotFoundException(
          `Comment with id ${id} not found or not authored by user ${authorId}`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting comment');
    }
  }
}
