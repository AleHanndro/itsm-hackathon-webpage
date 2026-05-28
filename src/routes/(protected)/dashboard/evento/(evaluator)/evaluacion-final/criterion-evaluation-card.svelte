<script lang="ts">
  import * as Card from '$lib/components/ui/card/index'
  import * as Collapsible from '$lib/components/ui/collapsible/index'
  import Slider from '$lib/components/ui/slider.svelte'
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
  import InfoIcon from '@lucide/svelte/icons/info'

  import type { RubricCriterion, RubricTier } from './schema'

  type TierVariant = 'developing' | 'excellent' | 'good' | 'unsatisfactory'

  const tierStyles: Record<TierVariant, { badge: string; callout: string; dot: string }> = {
    developing: {
      badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
      callout: 'border-amber-500/30 bg-amber-500/10',
      dot: 'bg-amber-500',
    },
    excellent: {
      badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
      callout: 'border-emerald-500/30 bg-emerald-500/10',
      dot: 'bg-emerald-500',
    },
    good: {
      badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
      callout: 'border-blue-500/30 bg-blue-500/10',
      dot: 'bg-blue-500',
    },
    unsatisfactory: {
      badge: 'bg-red-500/15 text-red-700 dark:text-red-400',
      callout: 'border-red-500/30 bg-red-500/10',
      dot: 'bg-red-500',
    },
  }

  let {
    criterion,
    open = $bindable(false),
    score = $bindable(0),
  }: {
    criterion: RubricCriterion
    open?: boolean
    score?: number
  } = $props()

  const getActiveTier = (criterion: RubricCriterion, score: number): RubricTier => {
    return (
      criterion.tiers.find((tier) => score >= tier.range[0] && score <= tier.range[1]) ??
      criterion.tiers[criterion.tiers.length - 1]
    )
  }

  const getTierVariant = (label: string): TierVariant => {
    if (label === 'Excelente') return 'excellent'
    if (label === 'Bueno') return 'good'
    if (label === 'En Desarrollo') return 'developing'
    return 'unsatisfactory'
  }

  let activeTier = $derived(getActiveTier(criterion, score))
  let activeTierStyles = $derived(tierStyles[getTierVariant(activeTier.label)])
</script>

<Card.Root class="overflow-hidden">
  <Card.Header class="pb-3">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div class="flex-1">
        <Card.Title class="text-base">{criterion.name}</Card.Title>
        <Card.Description class="mt-0.5">
          Máximo {criterion.maxScore} puntos
        </Card.Description>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-bold tabular-nums">{score}</span>
        <span class="text-sm text-muted-foreground">/ {criterion.maxScore}</span>
      </div>
    </div>
  </Card.Header>

  <Card.Content class="flex flex-col gap-4 pb-4">
    <div class="flex flex-col gap-2">
      <Slider max={criterion.maxScore} min={0} step={1} type="single" bind:value={score} />
      <input name={criterion.id} type="hidden" value={score} />
    </div>

    <div class={['rounded-md border px-3 py-2.5 transition-colors', activeTierStyles.callout]}>
      <div class="flex items-start gap-2">
        <span class={['mt-1.5 size-2 shrink-0 rounded-full', activeTierStyles.dot]}></span>
        <div class="flex flex-col gap-0.5">
          <span class={['text-xs font-semibold tracking-wide uppercase', activeTierStyles.badge]}>
            {activeTier.label}
            <span class="font-normal text-muted-foreground normal-case">
              ({activeTier.range[0]}-{activeTier.range[1]} pts)
            </span>
          </span>
          <p class="text-sm text-foreground/80">{activeTier.description}</p>
        </div>
      </div>
    </div>

    <Collapsible.Root bind:open>
      <Collapsible.Trigger
        class="flex w-full items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <InfoIcon class="size-3.5 shrink-0" />
        Ver rúbrica completa
        <ChevronDownIcon
          class={[
            'ml-auto size-3.5 shrink-0 transition-transform',
            {
              'rotate-180': open,
            },
          ]}
        />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div class="mt-3 flex flex-col divide-y rounded-md border text-sm">
          {#each criterion.tiers as tier (tier.label)}
            {@const tierVariant = getTierVariant(tier.label)}
            {@const styles = tierStyles[tierVariant]}
            <div class="flex gap-3 px-3 py-2.5">
              <span class={['mt-1.5 size-2 shrink-0 rounded-full', styles.dot]}></span>
              <div class="flex flex-col gap-0.5">
                <span class={['text-xs font-semibold', styles.badge]}>
                  {tier.label}
                  <span class="font-normal text-muted-foreground">
                    ({tier.range[0]}-{tier.range[1]} pts)
                  </span>
                </span>
                <p class="text-muted-foreground">{tier.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  </Card.Content>
</Card.Root>
