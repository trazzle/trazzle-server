import Mock = jest.Mock;

export type MockClassType<T> = { [key in keyof T]: Mock };

export type MockGuardType = { canActivate: (context: typeof mockContext)}