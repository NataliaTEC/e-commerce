export default class Product {
  constructor(id, name, category, subcategory, productType, price, stock, ruta) {
    this.id = id;
    this.name = name;
    this.category = category;      
    this.subcategory = subcategory; 
    this.productType = productType;  
    this.price = price;
    this.stock = stock;
    this.ruta = ruta;
  }
}
