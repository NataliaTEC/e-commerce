import express from "express";
import session from "express-session";
import cors from "cors";
import ProductRepositoryJSON from "./infra/ProductRepositoryJSON.js";
import ClientRepositoryJSON from "./infra/ClientRepositoryJSON.js";
import ECommerceFacade from "./facade/ECommerceFacade.js";
import Cart from "./domain/Cart.js";
import CartHistory from "./domain/memento/CartHistory.js";
import PaymentService from "./domain/PaymentService.js";
import Client from "./domain/Client.js";

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: true
  })
);
app.use(cors());

const productRepo = new ProductRepositoryJSON("./data/products.json");
const clientRepo = new ClientRepositoryJSON("./data/clients.json");

const ecommerceFacade = new ECommerceFacade(productRepo, clientRepo);

function requireFacade(req, res, next) {
  if (!req.session.facade)
    return res.status(401).json({ error: "Debes iniciar sesión" });
  next();
}


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

app.post("/api/cart/add", requireFacade, async (req, res) => {
  const { productId, quantity } = req.body;
  const result = await req.session.facade.agregarAlCarrito(productId, quantity);
  res.json(result);
});

app.post("/api/login", async (req, res) => {
  const user = await clientRepo.findByEmail(req.body.email);

  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
  if (user.password !== req.body.password)
    return res.status(401).json({ error: "Contraseña incorrecta" });

  const cart = new Cart();
  const cartHistory = new CartHistory();
  const paymentService = new PaymentService();
  const client = new Client(user.id, user.name, user.email);

  req.session.facade = new ECommerceFacade(
    productRepo,
    cart,
    paymentService,
    cartHistory,
    client
  );

  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API e-commerce escuchando en http://localhost:${PORT}`);
});
