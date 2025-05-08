import { Injectable } from "@nestjs/common";
import { ProductsService } from "../products/products.service";
import { initialData } from "./data/seed";

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ) {
  }

  async runSeed() {
    await this.seedServiceRunSeed();
    return "Seed executed";
  }

  private async seedServiceRunSeed() {
    await this.productService.removeAllProducts();

    const products = initialData.products;

    const insertPromisses = [];
    for (const product of products) {
      insertPromisses.push(await this.productService.create(product));

    }
    await Promise.all(insertPromisses);

    return true;
  }
}
