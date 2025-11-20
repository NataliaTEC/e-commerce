export default class Product {
  constructor(id, name, category, subcategory, productType, price, stock, marca, modelo, description, ruta) {
    this.id = id;
    this.name = name;
    this.category = category;      
    this.subcategory = subcategory; 
    this.productType = productType;  
    this.price = price;
    this.stock = stock;
    this.marca = marca;
    this.modelo = modelo;
    this.description = description;
    this.ruta = ruta;
  }
}
