<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'
withDefaults(defineProps<{items:NavigationMenuItem[];orientation?:'horizontal'|'vertical';label?:string}>(),{orientation:'horizontal',label:'메뉴'})
</script><template><UNavigationMenu :items="items" :orientation="orientation" :aria-label="label" class="w-full" /></template>
