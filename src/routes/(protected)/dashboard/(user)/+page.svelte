<script lang="ts">
  import type { LayoutData } from '../../$types'

  const { data }: { data: LayoutData } = $props()
</script>

<h1>
  Bienvenido {data.user.name}
</h1>
