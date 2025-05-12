import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDTO, LoginResDTO, RegisterBodyDTO, RegisterResDTO } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    console.log(body)
    const newUser = await this.authService.register(body)
    return new RegisterResDTO(newUser)
  }

  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    const user = await this.authService.login(body)
    return new LoginResDTO(user)
  }
}
