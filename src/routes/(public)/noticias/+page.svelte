<script lang="ts">
  import GridContainer from '$lib/components/grid-container.svelte'

  import type { PageProps } from './$types'

  import Footer from '../_components/footer.svelte'
  import PostCard from './_components/post-card.svelte'

  const { data }: PageProps = $props()
</script>

<header class="mt-16">
  <GridContainer>
    <h1
      class="px-2 font-display text-5xl leading-none font-bold tracking-tighter text-balance max-sm:px-4 lg:text-6xl xl:text-8xl"
    >
      Noticias.
    </h1>
  </GridContainer>

  <GridContainer class="mt-6 px-4 sm:px-2 md:mt-10">
    <p class="max-w-(--breakpoint-md) text-base/7 text-pretty text-muted-foreground">
      Mantente al día con las últimas noticias, eventos y actualizaciones sobre el Hackatón. Aquí
      encontrarás toda la información relevante para que no te pierdas de nada.
    </p>
  </GridContainer>
</header>

<div>
  <GridContainer>
    <span
      class="origin-bottom-right px-2 font-mono text-sm font-bold tracking-widest text-accent-2 uppercase select-none max-sm:px-4"
    >
      Tal vez te interese...
    </span>
  </GridContainer>

  <section class="mt-4">
    <GridContainer>
      {#if data.posts.length > 0}
        <ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each data.posts as post (post._meta.filePath)}
            <li class="p-4">
              <PostCard {post} />
            </li>
          {/each}
        </ul>
      {:else}
        <p>No hay noticias disponibles en este momento.</p>
      {/if}
    </GridContainer>
  </section>
</div>

<Footer />
