<template>
  <q-page padding class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Panel de Control</div>
        <div class="text-subtitle2 text-grey-7">Resumen general de tu tienda de barrio</div>
      </div>
      <q-chip color="blue-1" text-color="blue-8" icon="bolt" class="text-weight-medium">
        Sistema Activo
      </q-chip>
    </div>
    
    <!-- Tarjetas de Resumen Modernas -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-xs-12 col-sm-4">
        <q-card class="q-pa-md bg-white">
          <div class="row justify-between items-center">
            <div>
              <div class="text-subtitle2 text-grey-6 text-weight-medium">Total Productos</div>
              <div class="text-h3 text-weight-bold text-dark q-mt-sm">{{ store.totalProductos }}</div>
            </div>
            <q-avatar color="blue-1" text-color="blue-7" icon="inventory_2" size="56px" rounded />
          </div>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-card class="q-pa-md bg-white">
          <div class="row justify-between items-center">
            <div>
              <div class="text-subtitle2 text-grey-6 text-weight-medium">Alertas de Stock Bajo</div>
              <div class="text-h3 text-weight-bold text-red-7 q-mt-sm">{{ store.productosStockBajo.length }}</div>
            </div>
            <q-avatar color="red-1" text-color="red-7" icon="warning" size="56px" rounded />
          </div>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-card class="q-pa-md bg-white">
          <div class="row justify-between items-center">
            <div>
              <div class="text-subtitle2 text-grey-6 text-weight-medium">Valor Estimado Inventario</div>
              <div class="text-h4 text-weight-bold text-green-8 q-mt-sm">${{ store.valorTotalInventario.toLocaleString() }}</div>
            </div>
            <q-avatar color="green-1" text-color="green-7" icon="payments" size="56px" rounded />
          </div>
        </q-card>
      </div>
    </div>

    <!-- Alertas Urgentes / Tabla -->
    <div class="text-h6 text-weight-bold text-dark q-mb-md" v-if="store.productosStockBajo.length > 0">
      ⚠️ Productos con stock crítico
    </div>
    <q-table
      v-if="store.productosStockBajo.length > 0"
      :rows="store.productosStockBajo"
      :columns="columnsStockBajo"
      row-key="id"
      flat
      bordered
    />
    <q-banner v-else class="bg-white text-grey-8 q-pa-md" style="border-radius: 16px; border: 1px solid rgba(226, 232, 240, 0.8);">
      <template v-slot:avatar>
        <q-icon name="check_circle" color="positive" size="32px" />
      </template>
      <div class="text-weight-medium">¡Todo en orden! No hay productos con stock crítico en este momento.</div>
    </q-banner>
  </q-page>
</template>

<script setup>
import { useInventarioStore } from '../store/useInventarioStore'

const store = useInventarioStore()

const columnsStockBajo = [
  { name: 'nombre', label: 'Producto', field: 'nombre', align: 'left', sortable: true },
  { name: 'stock', label: 'Stock Actual', field: 'stock', align: 'center', sortable: true },
  { name: 'stockMinimo', label: 'Stock Mínimo', field: 'stockMinimo', align: 'center' }
]
</script>
