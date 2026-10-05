<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Barra Superior de Navegación -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          🛒 Sistema de Inventario - Tienda de Barrio
        </q-toolbar-title>
        <q-tabs shrink>
          <q-route-tab to="/" label="Panel / Alertas" icon="dashboard" />
          <q-route-tab to="/productos" label="Catálogo" icon="inventory" />
          <q-route-tab to="/movimientos" label="Movimientos kardex  " icon="swap_horiz" />
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