import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInventarioStore = defineStore('inventario', () => {
  
  // Función segura para leer de sessionStorage
  const cargarDatosIniciales = () => {
    try {
      const guardados = sessionStorage.getItem('inventario_datos')
      if (guardados) {
        return JSON.parse(guardados)
      }
    } catch (e) {
      console.error('Error al leer sessionStorage', e)
    }
    // Datos por defecto si está vacío
    return {
      productos: [
        { id: 1, codigo: 'A01', nombre: 'Arroz Diana 500g', precioCosto: 2200, precioVenta: 2800, stock: 15, stockMinimo: 5 },
        { id: 2, codigo: 'A02', nombre: 'Aceite Girasol 1L', precioCosto: 8500, precioVenta: 10500, stock: 3, stockMinimo: 4 },
        { id: 3, codigo: 'A03', nombre: 'Azúcar Rubia 1kg', precioCosto: 3500, precioVenta: 4200, stock: 8, stockMinimo: 5 },
        { id: 4, codigo: 'A04', nombre: 'Huevos AA (Huacal 30u)', precioCosto: 14000, precioVenta: 16500, stock: 2, stockMinimo: 6 }
      ],
      movimientos: [
        { id: 1, productoId: 1, tipo: 'ENTRADA', cantidad: 10, motivo: 'Surtido proveedor', fecha: '2026-09-14 08:30' },
        { id: 2, productoId: 2, tipo: 'SALIDA', cantidad: 2, motivo: 'Venta mostrador', fecha: '2026-09-15 10:15' }
      ]
    }
  }

  const datosIniciales = cargarDatosIniciales()

  // Definir las referencias con los datos cargados
  const productos = ref(datosIniciales.productos)
  const movimientos = ref(datosIniciales.movimientos)

  // Variables normales para métricas
  const totalProductos = ref(productos.value.length)
  const productosStockBajo = ref(productos.value.filter(p => p.stock <= p.stockMinimo))
  const valorTotalInventario = ref(
    productos.value.reduce((acc, p) => acc + (p.precioCosto * p.stock), 0)
  )

  function recalcularMetricas() {
    totalProductos.value = productos.value.length
    productosStockBajo.value = productos.value.filter(p => p.stock <= p.stockMinimo)
    valorTotalInventario.value = productos.value.reduce((acc, p) => acc + (p.precioCosto * p.stock), 0)
  }

  // Guardar cambios en sessionStorage inmediatamente
  function guardarTodo() {
    try {
      const estadoActual = {
        productos: productos.value,
        movimientos: movimientos.value
      }
      sessionStorage.setItem('inventario_datos', JSON.stringify(estadoActual))
    } catch (e) {
      console.error('Error al escribir en sessionStorage', e)
    }
    recalcularMetricas()
  }

  // Acciones
  function agregarProducto(nuevoProducto) {
    const id = productos.value.length ? productos.value[productos.value.length - 1].id + 1 : 1
    const codigoFormateado = nuevoProducto.codigo || `A${id < 10 ? '0' + id : id}`
    productos.value.push({ id, ...nuevoProducto, codigo: codigoFormateado })
    guardarTodo()
  }

  function eliminarProducto(id) {
    const index = productos.value.findIndex(p => p.id === id)
    if (index !== -1) {
      productos.value.splice(index, 1)
      guardarTodo()
    }
  }

  function registrarMovimiento(movimiento) {
    const id = movimientos.value.length ? movimientos.value[movimientos.value.length - 1].id + 1 : 1
    const fechaActual = new Date().toISOString().slice(0, 16).replace('T', ' ')
    
    movimientos.value.unshift({ id, ...movimiento, fecha: fechaActual })

    const producto = productos.value.find(p => p.id === Number(movimiento.productoId))
    if (producto) {
      if (movimiento.tipo === 'ENTRADA') {
        producto.stock += Number(movimiento.cantidad)
      } else if (movimiento.tipo === 'SALIDA' || movimiento.tipo === 'MERMA') {
        producto.stock -= Number(movimiento.cantidad)
        if (producto.stock < 0) producto.stock = 0
      }
    }

    guardarTodo()
  }

  // Ejecutar recuento inicial al arrancar
  recalcularMetricas()

  return {
    productos,
    movimientos,
    totalProductos,
    productosStockBajo,
    valorTotalInventario,
    agregarProducto,
    eliminarProducto,
    registrarMovimiento
  }
})