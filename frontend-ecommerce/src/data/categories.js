const categories = [
  { 
    id: 1,
    name: 'Computadoras',
    slug: 'computadoras',
    sub: [
      {
        name: 'PC de Escritorio',
        products: ['Pc gaming', 'Componentes']
      },
      {
        name: 'Laptops',
        products: ['Laptops', 'Accesorios']
      },
      {
        name: 'Ups y Energia',
        products: ['UPS', 'Reguladores de voltaje', 'Regletas', 'Powerbank']
      },
      {
        name: 'Impresoras',
        products: ['Impresoras multifuncional', 'Tintas y consumibles']
      }
    ]
  },
  { 
    id: 2,
    name: 'Perifericos',
    slug: 'perifericos',
    sub: [
      {
        name: 'Perifericos',
        products: ['Teclado', 'Mouse', 'Headset', 'Parlantes', 'Monitores', 'Camaras Web']
      },
      {
        name: 'Accesorios',
        products: ['Adaptadores', 'Cables', 'Cargadores', 'Mochilas', 'Bases y soportes']
      }
    ]
  },
  { 
    id: 3,
    name: 'Celulares, Relojes y Tablets',
    slug: 'celulares-relojes-tablets',
    sub: [
      {
        name: 'Celulares',
        products: ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Google', 'Huawei', 'Motorola', 'Honor']
      },
      {
        name: 'Relojes Inteligentes',
        products: ['Samsung', 'Apple', 'Xiaomi', 'Honor', 'Google', 'Huawei']
      },
      {
        name: 'Tablets',
        products: ['Samsung', 'Apple', 'Xiaomi', 'Lenovo', 'Huawei']
      },
      {
        name: 'Accesorios',
        products: ['Adaptadores', 'Cables', 'Cargadores', 'Powerbank', 'Soportes']
      }
    ]
  },
]

export default categories
