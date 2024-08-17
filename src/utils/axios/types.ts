export type ServerErrorGenericResponse = {
    statusCode: number
    message: string
    errors: ValidationObject[]
    _metadata: {
        languages: string[]
        timestamp: Date
        timezone: string
        requestId: string
        path: string
        version: string
        repoVersion: string
    }
}

export type ValidationObject = {
    property: string
    message: string
}
