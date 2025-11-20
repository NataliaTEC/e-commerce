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
  if (!id) return res.status(401).json({ error: "Debes iniciar sesión", redirect: "/login" });

  const facade = USERS.get(id);
  if (!facade) return res.status(401).json({ error: "Sesión inválida", redirect: "/login" });

  next();
}

app.get("/api/products", async (req, res) => {
  try {
    console.log('Query de búsqueda:', req.query);
    const { q } = req.query;
    const productos = await ecommerceFacade.listarProductos();

    if (!q || !q.trim()) {
      return res.json(productos);
    }

    const term = q.trim().toLowerCase();

    const filtrados = productos.filter((p) => {
      if (!p || typeof p.name !== "string") return false;
      return p.name.toLowerCase().includes(term);
    });

    return res.json(filtrados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

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

app.get("/api/products/subcategory/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const productos = await ecommerceFacade.listarProductosPorSubcategoria(slug);
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos por subcategoria" });
  }
});

app.post("/api/cart/add", requireFacade, async (req, res) => {
  const { productId, quantity } = req.body;
  const result = await getFacade(req).agregarAlCarrito(productId, quantity);

  res.json({ ok: true, items: result});
});

app.post("/api/cart/undo", requireFacade, async (req, res) => {
  const items = await getFacade(req).deshacerUltimoCambioCarrito();
  if (!items) {
    return res.status(400).json({ error: 'No hay cambios para deshacer' });
  }
  res.json({ ok: true, items: items });
});

app.get("/api/cart/get", requireFacade, async (req, res) => {
  const items = await getFacade(req).obtenerCarrito();
  res.json(items);
});

app.post("/api/cart/clear", requireFacade, async (req, res) => {
  getFacade(req).vaciarCarrito();
  res.json({ ok: true, items: [] });
});

app.post("/api/cart/remove", requireFacade, async (req, res) => {
  const { productId } = req.body;
  const items = await getFacade(req).quitarDelCarrito(productId);
  res.json({ ok: true, items: items });
});

app.post("/api/cart/update", requireFacade, async (req, res) => {
  const { productId, quantity, increment } = req.body;
  let items;
  if (increment) {
    items = await getFacade(req).agregarAlCarrito(productId, quantity);
  } else {
    items = await getFacade(req).actualizarCantidadDelCarrito(productId, quantity);
  }
  res.json({ ok: true, items: items });
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
