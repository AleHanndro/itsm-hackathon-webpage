<script lang="ts">
  import { cn, type WithoutChild } from '$lib/utils'
  import * as FormPrimitive from 'formsnap'

  let {
    children: childrenProp,
    class: className,
    errorClasses,
    ref = $bindable(null),
    ...restProps
  }: WithoutChild<FormPrimitive.FieldErrorsProps> & {
    errorClasses?: null | string | undefined
  } = $props()
</script>

<FormPrimitive.FieldErrors
  class={cn('text-sm font-medium text-destructive', className)}
  bind:ref
  {...restProps}
>
  {#snippet children({ errorProps, errors })}
    {#if childrenProp}
      {@render childrenProp({ errorProps, errors })}
    {:else}
      {#each errors as error (error)}
        <div {...errorProps} class={cn(errorClasses)}>{error}</div>
      {/each}
    {/if}
  {/snippet}
</FormPrimitive.FieldErrors>
