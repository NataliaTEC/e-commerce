const categories = [
  { 
    id: 1,
    name: 'Computadoras',
    slug: 'computadoras',
    sub: [
      {
        name: 'PC de escritorio',
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
      },
      {
        name: 'Silla y Escritorios',
        products: ['Sillas', 'Escritorios']
      }
    ]
  },
  { 
    id: 3,
    name: 'Dispositivos Móviles',
    slug: 'dispositivos-moviles',
    sub: [
      {
        name: 'Celulares',
        products: ['Samsung', 'Apple', 'Xiaomi', 'Google', 'Huawei']
      },
      {
        name: 'Relojes',
        products: ['Samsung', 'Apple', 'Xiaomi', 'Google',   'Huawei']
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
  { 
    id: 4,
    name: 'Gaming y streaming',
    slug: 'gaming-y-streaming',
    sub: [
      {
        name: 'Consolas',
        products: ['Consolas', 'Controles', 'Accesorios']
      },
      {
        name: 'Racing',
        products: ['Volantes', 'Pedales', 'Asientos']
      },
      {
        name: 'Silla y Escritorios',
        products: ['Sillas', 'Escritorios']
      }
    ]
  },
  { 
    id: 5,
    name: 'Audio',
    slug: 'audio',
    sub: [
      {
        name: 'Micrófonos',
        products: ['Micrófonos', 'Accesorios']
      },
      {
        name: 'Parlantes',
        products: ['Parlantes PC', 'Parlantes Bluetooth', 'Barras de sonido']
      },
      {
        name: 'Audífonos',
        products: ['Audífonos In-Ear', 'Audífonos Over-Ear', 'Audífonos Gaming']
      }
    ]
  },
  { 
    id: 6,
    name: 'Video',
    slug: 'video',
    sub: [
      {
        name: 'Televisores',
        products: ['Televisores', 'Soportes', 'Accessorios']
      },
      {
        name: 'Cámaras',
        products: ['Cámaras fotográficas', 'Cámaras de acción', 'Dash cams']
      },
      {
        name: 'Drones',
        products: ['Drones', 'Accesorios']
      }
    ]
  },
  { 
    id: 7,
    name: 'Hogar y smarthome',
    slug: 'hogar-y-smarthome',
    sub: [
      {
        name: 'Smart Home',
        products: ['Parlantes inteligentes', 'Iluminación', 'Tomacorrientes', 'Interruptores']
      },
      {
        name: 'Vigilancia y monitoreo',
        products: ['Cámaras de seguridad', 'Detectores de movimiento', 'Alarmas']
      },
      {
        name: 'Routers y switches',
        products: ['Routers', 'Switches', 'Extensores de cobertura']
      }
    ]
  },
]

export default categories
