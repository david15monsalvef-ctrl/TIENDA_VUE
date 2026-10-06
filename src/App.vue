<template>
  <q-layout view="lHh Lpr lFf" style="background-color: #f3f4f6;">
    <!-- Barra Superior de Navegación -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-lg">
        <q-toolbar-title class="text-weight-bold" style="font-size: 18px;">
          🛒 Sistema de Inventario - Tienda de Barrio
        </q-toolbar-title>
        
        <q-tabs dense align="right" active-color="yellow-4" indicator-color="yellow-4">
          <q-route-tab to="/" label="Panel / Alertas" icon="dashboard" no-caps />
          <q-route-tab to="/productos" label="Catálogo" icon="inventory" no-caps />
          <q-route-tab to="/movimientos" label="Movimientos" icon="swap_horiz" no-caps />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <!-- Contenedor Principal de las Vistas -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Layout principal con Quasar
</script>