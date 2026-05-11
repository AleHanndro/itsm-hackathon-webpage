<script lang="ts">
  import type { PageData } from './$types'

  const { data }: { data: PageData } = $props()
</script>

<h1>
  Bienvenido {data.user.name}
</h1>
