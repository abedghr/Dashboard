export type LoginResponse = {
    username: string
    role: string
    tokenType: string
    expiresIn: number
    accessToken: string
    refreshToken: string
    firstName: string
    lastName: string
}

export type RefreshTokenResponse = {}
