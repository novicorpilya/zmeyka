import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    v: number;
}
interface ValidatedUserPayload {
    id: string;
    email: string;
    role: Role;
    tokenVersion: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    constructor(config: ConfigService);
    validate(payload: JwtPayload): Promise<ValidatedUserPayload>;
}
export {};
