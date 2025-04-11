import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  getPosts() {
    return 'all posts'
  }

  createPost(body: any) {
    return body
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
