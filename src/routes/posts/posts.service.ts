import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts() {
    return this.prismaService.post.findMany()
  }

  createPost(body: any) {
    const authorId = 1
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId,
      },
    })
  }

  getPostsById(id: string) {
    return id
  }

  updatePost(id: string, body: any) {
    return { id, ...body }
  }

  deletePost(id: string) {
    return `${id} deleted`
  }
}
