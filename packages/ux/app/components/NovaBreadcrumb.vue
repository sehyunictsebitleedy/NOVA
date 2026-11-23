<script setup lang="ts">
import type {BreadcrumbItem} from '@nuxt/ui'
defineProps<{items:BreadcrumbItem[]}>()
</script><template><UBreadcrumb :items="items" aria-label="현재 위치" /></template>
