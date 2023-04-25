import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";


describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Creating fake UserService
    const users: User[] = [{ id: 1, email: "existing@email.com", password: "password"} as User];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const newUser = { id: Math.floor(Math.random() * 999), email, password } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      }
    };

    const module = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }]
    }).compile();

    service = module.get(AuthService);
  });

  it("can create an instance of AuthService", async function() {
    expect(service).toBeDefined();
  });

  it("should salt and hash the password provided to the service", async function() {
    const user = await service.signup("some@email.com", "myPassword");
    expect(user.password).not.toEqual("myPassword");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if user signs up with email that is in use", async () => {
    await expect(service.signup("existing@email.com", "password")).rejects.toThrow(
      BadRequestException
    );
  });

  it("throws if signin is called with an unused email", async () => {
    await expect(
      service.signin("some@email.com", "password")
    ).rejects.toThrow(NotFoundException);
  });

  it("throws if an invalid password is provided", async () => {
    await service.signup("some@email.com", "password")

    await expect(
      service.signin("some@email.com", "wrongPassword")
    ).rejects.toThrow(BadRequestException);
  });

  it("should return a user when correct password provided", async function() {
    await service.signup("some@email.com", "password");

    const user = await service.signin("some@email.com", "password");
    expect(user).toBeDefined();
  });
});
