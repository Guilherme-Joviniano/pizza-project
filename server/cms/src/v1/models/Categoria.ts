import { db } from "../configs/database";

class Categoria {
  async save(data: { name: string }) {
    const response = await db.tbl_category.create({
      data: {
        name: data.name,
        status: true,
      },
    });

    return response;
  }
  async delete(id: number) {
    const response = await db.tbl_category.update({
      data: {
        status: false,
      },
      where: {
        id,
      },
    });

    if (!response) return false;

    const allProducts = await db.tbl_category.findMany({
      include: {
        product: true,
      },
      where: {
        id,
      },
    });

    const productsIds = allProducts.map((item) => item.id);

    await Promise.all(
      productsIds.map(async (id) => {
        await db.product.update({
          where: {
            id: id as number,
          },
          data: {
            status: false,
          },
        });
      })
    );

    return true;
  }
  async update(data: { name: string; id: number }) {
    const response = await db.tbl_category.update({
      data: {
        name: data.name,
      },
      where: {
        id: data.id,
      },
    });

    return response;
  }
  async index() {
    const response = await db.tbl_category.findMany();

    return response;
  }
  async show(id: number) {
    const response = await db.tbl_category.findUnique({
      where: {
        id,
      },
    });

    return response;
  }
  async getByName(name: string) {
    const response = await db.tbl_category.findMany({
      where: {
        name,
      },
    });

    if (response.length <= 0) return false;
    return response[0];
  }

  async activate(id: number) {
    const response = await db.tbl_category.update({
      data: {
        status: true,
      },
      where: {
        id,
      },
    });

    if (!response) return false;

    const allProducts = await db.tbl_category.findMany({
      include: {
        product: true,
      },
      where: {
        id,
      },
    });

    const productsIds = allProducts.map((item) => item.id);

    await Promise.all(
      productsIds.map(async (id) => {
        await db.product.update({
          where: {
            id: id as number,
          },
          data: {
            status: true,
          },
        });
      })
    );

    return true;
  }
}

export default new Categoria();
