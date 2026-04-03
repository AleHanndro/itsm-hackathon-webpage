<script lang="ts">
  import type { ClassValue } from 'clsx'
  import type { Snippet } from 'svelte'

  import { cn } from '$lib/utils'

  const {
    children,
    class: className,
    title,
  }: { children: Snippet; class?: ClassValue; title: string } = $props()

  const faqGroupId = () =>
    'faq-' +
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
</script>

<div id={faqGroupId()} class={cn('group', className)}>
  <h3
    class="block px-2 py-2 font-mono text-[0.8125rem]/6 font-bold tracking-widest text-balance text-muted-foreground uppercase max-sm:px-4"
  >
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href="#{faqGroupId()}">{title}</a>
  </h3>

  <dl>
    {@render children()}
  </dl>
</div>
