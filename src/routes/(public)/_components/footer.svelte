<script lang="ts">
  import GithubIcon from '$lib/components/icons/github.svelte'
</script>

<footer class="flex w-full flex-col items-center gap-4 pt-24">
  <div>
    <a
      href="https://github.com/AleHanndro/itsm-hackathon-webpage"
      rel="noopener noreferrer"
      target="_blank"
    >
      <GithubIcon class="size-6 transition-[filter] not-hover:brightness-50" />
    </a>
  </div>

  <p class="text-sm text-muted-foreground">
    2026 <a
      class="underline decoration-dotted underline-offset-2 hover:decoration-accent hover:decoration-solid"
      href="https://itsmotul.edu.mx/"
      rel="noopener noreferrer"
      target="_blank"
    >
      Instituto Tecnológico Superior de Motul
    </a>.
  </p>
</footer>
