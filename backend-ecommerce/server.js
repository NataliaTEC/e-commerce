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
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));

const USERS = new Map();

const productRepo = new ProductRepositoryJSON("./data/products.json");
const clientRepo = new ClientRepositoryJSON("./data/clients.json");

const ecommerceFacade = new ECommerceFacade(productRepo, new Cart(), new PaymentService(), new CartHistory());

function getFacade(req) {
  const id = req.session.userId;
  if (!id) return null;
  return USERS.get(id);
}

function requireFacade(req, res, next) {
  const id = req.session.userId;
  if (!id) return res.status(401).json({ error: "Debes iniciar sesión" });

  const facade = USERS.get(id);
  if (!facade) return res.status(401).json({ error: "Sesión inválida" });

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
  console.log(USERS);
  const result = await getFacade(req).agregarAlCarrito(productId, quantity);
  console.log(result);
  console.log("despues de agregar al carrito");
  console.log(USERS);
  console.log("--------------");
  console.log(USERS.get(req.session.userId).cart.getItems());
  res.json({ ok: true, items: result});
});

app.get("/api/cart/get", requireFacade, async (req, res) => {
  const items = await getFacade(req).obtenerCarrito();
  res.json(items);
});

app.post("/api/login", async (req, res) => {
  const user = await clientRepo.findByEmail(req.body.email);

  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
  if (!user.verifyPassword(req.body.password))
    return res.status(401).json({ error: "Contraseña incorrecta" });

  const cart = new Cart();
  const cartHistory = new CartHistory();
  const paymentService = new PaymentService();
  const client = new Client(user.id, user.name, user.email);

  const facade = new ECommerceFacade(
    productRepo,
    cart,
    paymentService,
    cartHistory,
    client
  );

  req.session.userId = user.id
  USERS.set(user.id, facade);

  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API e-commerce escuchando en http://localhost:${PORT}`);
});
