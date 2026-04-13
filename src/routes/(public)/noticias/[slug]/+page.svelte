<script lang="ts">
  import GridContainer from '$lib/components/grid-container.svelte'

  import type { PageProps } from './$types'

  import BackToNews from './_components/back-to-news.svelte'
  import CoverImage from './_components/cover-image.svelte'
  import PostInformation from './_components/post-information.svelte'

  const { data }: PageProps = $props()
</script>

<svelte:head>
  <title>{data.post.title}</title>
  <meta name="title" content={data.post.title} />
  <meta name="description" content={data.post.summary} />
</svelte:head>

<header class="mx-auto w-full max-w-(--breakpoint-md) lg:border-x lg:border-x-line">
  <div class="mt-16 px-4">
    <BackToNews />
    <PostInformation category={data.post.category} date={data.post.date} />

    <GridContainer>
      <h1
        class="font-display text-4xl leading-none font-bold tracking-tighter text-balance text-accent md:text-5xl lg:text-7xl"
      >
        {data.post.title}
      </h1>
    </GridContainer>

    {#if data.post.tags.length > 0}
      <GridContainer class="mt-4 flex gap-x-1.5 md:gap-x-4">
        {#each data.post.tags as tag (tag)}
          <span
            class="cursor-pointer rounded bg-muted-foreground/10 px-1.5 py-0.5 font-mono text-sm font-bold text-muted-foreground transition-colors hover:bg-muted-foreground/20"
          >
            #{tag}
          </span>
        {/each}
      </GridContainer>
    {/if}
  </div>

  {#if data.post.cover}
    <div class="line-y mt-6 w-full md:mt-10">
      <CoverImage
        class="aspect-video w-full object-cover"
        alt={data.post.cover.alt}
        fetchpriority="high"
        isExternal={data.post.cover.isExternal}
        src={data.post.cover.src}
      />
    </div>
  {/if}
</header>

<article
  class="line-y mx-auto prose w-full max-w-(--breakpoint-md) px-4 py-10 [--radius:0.25rem] lg:prose-lg lg:border-x lg:border-x-line prose-headings:font-display"
>
  <data.post.component />
</article>

<style>
  .prose :global {
    > section:first-of-type > *:first-child,
    > *:first-child {
      margin-block-start: 0;
    }

    > section:last-of-type > *:last-child,
    > *:last-child {
      margin-block-end: 0;
    }

    :is(h1, h2, h3, h4, h5, h6):where(:not(.not-prose, .not-prose *)) {
      position: relative;

      &:has(a) > a {
        font-weight: inherit;
        color: inherit;
        text-decoration: none;

        &:hover::after {
          content: '#';
          color: var(--color-accent-3);
          padding-inline-start: 0.5em;
        }
      }
    }

    code:where(:not(.not-prose, .not-prose *)) {
      &::before,
      &::after {
        content: none;
      }

      font-weight: var(--font-weight-bold);
      background-color: color-mix(in oklab, var(--color-accent-2) 15%, transparent);
      border-radius: var(--radius);
      padding-block: 0.2em;
      padding-inline: 0.4em;
    }
  }
</style>
