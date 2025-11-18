// backend-ecommerce/infra/ProductRepositoryJSON.js
import fs from "fs/promises"
import path from "path"
import Product from "../domain/Product.js"

export default class ProductRepositoryJSON {
  constructor(jsonPath) {
    this.jsonPath = jsonPath
  }

  async getAll() {
    const fullPath = path.resolve(this.jsonPath)
    const raw = await fs.readFile(fullPath, "utf8")
    const data = JSON.parse(raw)

    return data.map(
      (p) =>
        new Product(
          p.id,
          p.name,
          p.category,
          p.subcategory,
          p.productType,
          p.price,
          p.stock,
          p.ruta
        )
    )
  }

  async getByCategory(categorySlug) {
    const all = await this.getAll()
    return all.filter((p) => p.category === categorySlug)
  }

  async getById(id) {
    const all = await this.getAll()
    return all.find((p) => p.id === id) || null
  }
}
