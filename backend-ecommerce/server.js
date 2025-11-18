import express from "express";
import cors from "cors";
import ProductRepositoryJSON from "./infra/ProductRepositoryJSON.js";
import ECommerceFacade from "./facade/ECommerceFacade.js";

const app = express();
app.use(express.json());
app.use(cors());

const productRepo = new ProductRepositoryJSON("./data/products.json");
const ecommerceFacade = new ECommerceFacade(productRepo);


app.get("/api/products", async (req, res) => {
  try {
    const productos = await ecommerceFacade.listarProductos();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Productos por categoría
app.get("/api/products/category/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const productos = await ecommerceFacade.listarProductosPorCategoria(slug);
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos por categoria" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API e-commerce escuchando en http://localhost:${PORT}`);
});
