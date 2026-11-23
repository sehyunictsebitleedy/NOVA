<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'
withDefaults(defineProps<{items:NavigationMenuItem[];label?:string}>(),{label:'사이드 메뉴'})
</script><template><NovaMenu :items="items" orientation="vertical" :label="label" /></template>
