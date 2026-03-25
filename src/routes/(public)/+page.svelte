<script lang="ts">
  import { onMount } from 'svelte'

  let time = $state('')

  onMount(() => {
    time = new Date().toLocaleTimeString()
    const interval = setInterval(() => {
      time = new Date().toLocaleTimeString()
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })
</script>

<h1 class="text-3xl font-bold underline">ITSM Hackathon 2026A</h1>
<p class="text-lg text-gray-600">Hora actual: {time}</p>
