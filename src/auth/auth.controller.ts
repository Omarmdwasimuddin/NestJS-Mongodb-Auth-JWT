import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor( private authService: AuthService ) {}

    @Post('signup')
    async signup( @Body() body: { email: string, password: string } ) {
        return this.authService.signup( body.email, body.password );
    }

    @Post('login')
    async login( @Body() body: { email: string, password: string } ) {
        return this.authService.login( body.email, body.password );
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile( @Request() req ) {
        return req.user;
    }

}