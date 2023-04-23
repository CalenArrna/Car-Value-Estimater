import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {
  }

  async signup(email: string, password: string) {
    // Check if email registered
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException("Email is in use!");
    }
    // Hash the password
    // Generate Salt (1 byte -> 2 characters = 18 chars here)
    const salt = randomBytes(8).toString("hex");
    // Hash password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + "." + hash.toString("hex");
    // Create and save user
    const user = this.userService.create(email, result);

    // Return user
    return user;
  }

  signin() {
  }
}