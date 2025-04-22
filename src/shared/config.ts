//Check env is exist
import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config({
  path: '.env',
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('No .env file found. Please create one.')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
}

const configServer = plainToInstance(ConfigSchema, process.env)

const validateConfig = validateSync(configServer)
if (validateConfig.length > 0) {
  console.log('env is not valid')
  const errors = validateConfig.map((item) => {
    return {
      property: item.property,
      constraints: item.constraints,
      value: item.value,
    }
  })
  throw errors
}

const envConfig = configServer

export default envConfig
