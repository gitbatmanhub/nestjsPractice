import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "../common/dto/pagination.dto";
import { isUUID } from "class-validator";
import { Product, ProductImage } from "./entities";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const { image = [], ...productDetails } = createProductDto;
      let product = this.productRepository.create({
        ...productDetails,
        image: image.map((image) =>
          this.productImageRepository.create({ url: image })
        )
      });
      product = await this.productRepository.save(product);
      return { ...product, image };
    } catch (e) {
      this.handlerDbException(e);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { image: true }
    });
    return product.map((product) => ({
      ...product,
      image: product.image.map((img) => img.url)
    }));
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      //product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder("prod");
      product = await queryBuilder
        .where("UPPER(title) =:title or slug =:slug", {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        })
        .leftJoinAndSelect("prod.image", "prodImages")
        .getOne();
    }
    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    }
    return product;
  }

  async findOnPlain(term: string) {
    const { image = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: image.map((image) => image.url)
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { image, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
      image: []
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    //Create queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (image) {
        await queryRunner.manager.delete(ProductImage, {
          product: { id: product.id }
        });
        product.image = image.map((image) =>
          this.productImageRepository.create({ url: image })
        );
        await queryRunner.manager.save(product);
      }

      //return await this.productRepository.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnPlain(id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handlerDbException(e);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async removeAllProducts() {
    const queryBuilder = this.productRepository.createQueryBuilder("product");
    try {
      return await queryBuilder.delete().where({}).execute();
    } catch (e) {
      return this.handlerDbException(e);
    }
  }

  private handlerDbException(error: any) {
    if (error.code === "23505") {
      this.logger.error(`Error occurred: ${error.message}`);
      throw new InternalServerErrorException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(error.message);
  }
}
