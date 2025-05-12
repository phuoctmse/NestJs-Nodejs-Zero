import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService
  ) { }
  async register(body) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      })
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists')
      }
      console.log(error)
      throw error
    }
  }

  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!user) {
      throw new UnprocessableEntityException([
        {
          field: 'email',
          error: 'User not found'
        }
      ])
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Invalid password'
        }
      ])
    }

    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload)
    ])
    const decodedToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        userId: decodedToken.userId,
        token: refreshToken,
        expiresAt: new Date(decodedToken.exp * 1000)
      }
    })
    return {
      accessToken,
      refreshToken
    }
  }
}
