<template>
  <q-page padding class="q-pa-lg">
    <div class="row justify-between items-center q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Catálogo de Productos</div>
        <div class="text-subtitle2 text-grey-7">Administra los artículos, códigos únicos (SKU) y precios de tu inventario</div>
      </div>
      <q-btn color="primary" icon="add" label="Nuevo Producto" unelevated @click="dialogo = true" />
    </div>

    <q-card flat bordered class="q-pa-none bg-white modern-card">
      <q-table
        :rows="store.productos"
        :columns="columns"
        row-key="id"
        :filter="filtro"
        flat
      >
        <template v-slot:top>
          <div class="row full-width justify-between items-center q-py-sm q-px-md">
            <div class="text-weight-bold text-subtitle1 text-dark">Lista de Artículos Registrados</div>
            <q-input dense outlined debounce="300" v-model="filtro" placeholder="Buscar por nombre o código..." style="width: 300px">
              <template v-slot:prepend>
                <q-icon name="search" color="grey-5" />
              </template>
            </q-input>
          </div>
        </template>
        
        <!-- Diseño personalizado para el código único -->
        <template v-slot:body-cell-codigo="props">
          <q-td :props="props">
            <q-chip color="blue-1" text-color="primary" dense class="text-weight-bold q-px-sm">
              {{ props.row.codigo }}
            </q-chip>
          </q-td>
        </template>

        <!-- Columna de Acciones (Eliminar) -->
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" align="center">
            <q-btn 
              flat 
              dense 
              round 
              icon="delete" 
              color="negative" 
              @click="store.eliminarProducto(props.row.id)"
            >
              <q-tooltip>Eliminar producto</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal Moderno -->
    <q-dialog v-model="dialogo">
      <q-card style="width: 450px; max-width: 90vw; border-radius: 20px;" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Registrar Nuevo Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md q-mt-sm">
          <q-input v-model="form.codigo" label="Código Único (Ej: A05 - Opcional)" outlined dense />
          <q-input v-model="form.nombre" label="Nombre del producto" outlined dense />
          <q-input v-model.number="form.precioCosto" type="number" label="Precio Costo ($)" outlined dense />
          <q-input v-model.number="form.precioVenta" type="number" label="Precio Venta ($)" outlined dense />
          <q-input v-model.number="form.stock" type="number" label="Stock Inicial" outlined dense />
          <q-input v-model.number="form.stockMinimo" type="number" label="Stock Mínimo de Alerta" outlined dense />
        </q-card-section>

        <q-card-actions align="right" class="q-mt-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn label="Guardar Producto" color="primary" unelevated @click="guardarProducto" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useInventarioStore } from '../store/useInventarioStore'

const store = useInventarioStore()
const filtro = ref('')
const dialogo = ref(false)

const form = ref({
  codigo: '',
  nombre: '',
  precioCosto: 0,
  precioVenta: 0,
  stock: 0,
  stockMinimo: 5
})

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nombre', label: 'Producto', field: 'nombre', align: 'left', sortable: true },
  { name: 'precioCosto', label: 'Costo ($)', field: 'precioCosto', format: val => `$${val.toLocaleString()}`, sortable: true },
  { name: 'precioVenta', label: 'Venta ($)', field: 'precioVenta', format: val => `$${val.toLocaleString()}`, sortable: true },
  { name: 'stock', label: 'Stock Actual', field: 'stock', align: 'center', sortable: true },
  { name: 'stockMinimo', label: 'Stock Mínimo', field: 'stockMinimo', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

function guardarProducto() {
  if (!form.value.nombre) return
  store.agregarProducto({ ...form.value })
  form.value = { codigo: '', nombre: '', precioCosto: 0, precioVenta: 0, stock: 0, stockMinimo: 5 }
}
</script>

<style scoped>
.modern-card {
  border-radius: 20px !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04) !important;
}
</style>