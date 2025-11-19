// backend-ecommerce/infra/ProductRepositoryJSON.js
import fs from "fs/promises"
import path from "path"
import Client from "../domain/Client.js"

export default class ClientRepositoryJSON {
  constructor(jsonPath) {
    this.jsonPath = jsonPath
  }

  async getAll() {
    const fullPath = path.resolve(this.jsonPath)
    const raw = await fs.readFile(fullPath, "utf8")
    const data = JSON.parse(raw)

    return data.map(
      (p) =>
        new Client(
          p.id,
          p.name,
          p.email,
          p.password
        )
    )
  }

  async getById(id) {
    const all = await this.getAll()
    return all.find((p) => p.id === id) || null
  }

async findByEmail(email) {
    const all = await this.getAll()
    return all.find((p) => p.email === email) || null
  }
}
