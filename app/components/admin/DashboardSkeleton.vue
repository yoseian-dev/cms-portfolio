<template>
  <div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <USkeleton
        v-for="item in 4"
        :key="item"
        class="h-28 w-full bg-gray-200 dark:bg-gray-800"
      />
    </div>

    <USkeleton class="h-80 w-full bg-gray-200 dark:bg-gray-800" />
  </div>
</template>