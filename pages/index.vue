<script setup lang="ts">
const { data, isLoading } = useGetBalance(2)
</script>

<template>{{ data }}</template>
