<script lang="ts">
  import type { Snippet } from 'svelte'

  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'

  const { children, question }: { children: Snippet; question: string } = $props()
</script>

<details class="group border-t border-line px-4 py-3 sm:px-2">
  <summary
    class="flex justify-between select-none group-open:text-accent-3 marker:hidden [&_>_svg]:shrink-0"
  >
    <span class="text-display text-sm/7 font-semibold text-pretty">
      {question}
    </span>
    <ChevronRightIcon class="h-7 w-4 group-open:hidden" />
    <ChevronDownIcon class="h-7 w-4 not-group-open:hidden" />
  </summary>
  <div
    class="prose mt-4 duration-500 [--tw-prose-bullets:var(--color-accent-3)] [--tw-prose-counters:var(--color-accent-3)]"
  >
    {@render children()}
  </div>
</details>
