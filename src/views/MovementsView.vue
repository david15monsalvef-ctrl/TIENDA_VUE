<template>
  <q-page padding class="q-pa-lg">
    <div class="q-mb-lg">
      <div class="text-h4 text-weight-bold text-dark">Movimientos de Inventario</div>
      <div class="text-subtitle2 text-grey-7">Registra entradas, salidas o mermas de mercancía con control de kardex</div>
    </div>

    <!-- Formulario de Nueva Transacción -->
    <q-card flat bordered class="q-pa-md q-mb-xl bg-white modern-card">
      <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Nueva Transacción</div>
      
      <div class="row q-col-gutter-md items-center">
        <!-- Selector con código y nombre -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="form.productoId"
            :options="store.productos"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            label="Seleccionar Producto"
            outlined
            dense
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    <q-chip color="blue-1" text-color="primary" dense class="q-mr-xs">{{ scope.opt.codigo }}</q-chip>
                    {{ scope.opt.nombre }}
                  </q-item-label>
                  <q-item-label caption>Stock actual: {{ scope.opt.stock }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="form.tipo"
            :options="['ENTRADA', 'SALIDA', 'MERMA']"
            label="Tipo de Movimiento"
            outlined
            dense
          />
        </div>

        <div class="col-12 col-md-2">
          <q-input
            v-model.number="form.cantidad"
            type="number"
            label="Cantidad"
            outlined
            dense
            min="1"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-input
            v-model="form.motivo"
            label="Motivo (ej. Venta, Proveedor)"
            outlined
            dense
          />
        </div>
      </div>

      <div class="row justify-end q-mt-md">
        <q-btn
          color="primary"
          icon="save"
          label="Registrar Movimiento"
          unelevated
          @click="registrar"
        />
      </div>
    </q-card>

    <!-- Historial Reciente (Kardex) -->
    <q-card flat bordered class="q-pa-none bg-white modern-card">
      <q-table
        :rows="movimientosConProducto"
        :columns="columns"
        row-key="id"
        flat
      >
        <template v-slot:top>
          <div class="text-weight-bold text-subtitle1 text-dark q-py-sm">Historial Reciente</div>
        </template>

        <!-- Columna de Código en la tabla -->
        <template v-slot:body-cell-codigo="props">
          <q-td :props="props">
            <q-chip color="blue-1" text-color="primary" dense class="text-weight-bold q-px-sm">
              {{ props.row.codigoProducto }}
            </q-chip>
          </q-td>
        </template>

        <!-- Estilo personalizado para el tipo de movimiento -->
        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.tipo === 'ENTRADA' ? 'green-1' : 'red-1'"
              :text-color="props.row.tipo === 'ENTRADA' ? 'green-9' : 'red-9'"
              dense
              class="text-weight-bold q-px-sm"
            >
              {{ props.row.tipo }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useInventarioStore } from '../store/useInventarioStore'

const store = useInventarioStore()

const form = ref({
  productoId: null,
  tipo: 'SALIDA',
  cantidad: 1,
  motivo: ''
})

const movimientosConProducto = ref([])

function actualizarListaMovimientos() {
  movimientosConProducto.value = store.movimientos.map(m => {
    const prod = store.productos.find(p => p.id === m.productoId)
    return {
      ...m,
      nombreProducto: prod ? prod.nombre : 'Producto Eliminado',
      codigoProducto: prod ? prod.codigo : 'N/A'
    }
  })
}

actualizarListaMovimientos()

const columns = [
  { name: 'fecha', label: 'Fecha y Hora', field: 'fecha', align: 'left', sortable: true },
  { name: 'codigo', label: 'Código', field: 'codigoProducto', align: 'left', sortable: true },
  { name: 'producto', label: 'Producto', field: 'nombreProducto', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'center', sortable: true },
  { name: 'cantidad', label: 'Cantidad', field: 'cantidad', align: 'center', sortable: true },
  { name: 'motivo', label: 'Motivo', field: 'motivo', align: 'left' }
]

function registrar() {
  if (!form.value.productoId) {
    alert('Por favor seleccione un producto')
    return
  }
  if (form.value.cantidad <= 0) {
    alert('La cantidad debe ser mayor a 0')
    return
  }

  // Buscar el producto seleccionado para validar el stock disponible
  const productoSeleccionado = store.productos.find(p => p.id === Number(form.value.productoId))

  if (productoSeleccionado) {
    // Validar si es Salida o Merma y la cantidad supera el stock actual
    if ((form.value.tipo === 'SALIDA' || form.value.tipo === 'MERMA') && form.value.cantidad > productoSeleccionado.stock) {
      alert(`¡Stock insuficiente! El producto "${productoSeleccionado.nombre}" solo tiene ${productoSeleccionado.stock} unidades disponibles.`)
      return // Detiene el registro
    }
  }

  // Si pasa la validación, registra el movimiento
  store.registrarMovimiento({ ...form.value })
  
  actualizarListaMovimientos()
  
  // Limpiar formulario
  form.value = {
    productoId: null,
    tipo: 'SALIDA',
    cantidad: 1,
    motivo: ''
  }

  alert('Movimiento registrado con éxito')
}
</script>

<style scoped>
.modern-card {
  border-radius: 20px !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04) !important;
}
</style>