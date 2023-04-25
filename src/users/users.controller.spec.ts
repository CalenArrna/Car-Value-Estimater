import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { NotFoundException } from "@nestjs/common";


describe("UsersController", () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      // async signup(email: string, password: string): Promise<User> {
      // },
      async signin(email: string, password: string): Promise<User> {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    };

    fakeUserService = {
      find(email: string): Promise<User[]> {
        return Promise.resolve([{ id: 1, email, password: "pwd" } as User]);
      },
      findOne(id: number): Promise<User> {
        return Promise.resolve({ id, email: "some@email.com", password: "pwd" } as User);
      }
      // async remove(id: number): Promise<User> {
      // },
      // async update(id: number, attrs: Partial<User>): Promise<User> {
      // }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers should return a list of found users with given email ", async function() {
    const users = await controller.findAllUsers("some@email.com");
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("some@email.com");
  });

  it("findUser should return a user with the given id", async function() {
    const user = await controller.findUser("1");
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it("findUser throws an error if user with given id is not found", async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser("1")).rejects.toThrow(NotFoundException);
  });

  it("signin updates session object and returns user", async function() {
    const session = {userId: -1};
    const user = await controller.signInUser(
      { email: "some@email.com", password: "pwd" }, session
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
