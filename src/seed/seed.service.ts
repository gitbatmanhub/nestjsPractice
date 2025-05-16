import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteAllTables();
    const adminUser = await this.insertUsers();
    await this.seedServiceRunSeed(adminUser);
    return 'Seed executed';
  }

  private async deleteAllTables() {
    await this.productService.removeAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).delete();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    await this.userRepository.save(users);
    return users[0];
  }

  private async seedServiceRunSeed(user: User) {
    await this.productService.removeAllProducts();

    const products = initialData.products;

    const insertPromisses = [];
    for (const product of products) {
      insertPromisses.push(await this.productService.create(product, user));
    }
    await Promise.all(insertPromisses);

    return true;
  }
}
