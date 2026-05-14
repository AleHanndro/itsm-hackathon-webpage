<script generics="T extends Record<string, unknown>, Path extends FormPathLeaves<T>" lang="ts">
  import type { FormPath, FormPathLeaves, SuperForm } from 'sveltekit-superforms'

  import Button from '$lib/components/ui/button.svelte'
  import * as Command from '$lib/components/ui/command/index'
  import * as Form from '$lib/components/ui/form/index'
  import * as Popover from '$lib/components/ui/popover/index'
  import { cn } from '$lib/utils'
  import CheckIcon from '@lucide/svelte/icons/check'
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down'
  import UserIcon from '@lucide/svelte/icons/user'
  import { tick } from 'svelte'

  import type { Member } from '../schema'

  const {
    form,
    label,
    name,
    users = [],
  }: {
    form: SuperForm<T>
    label: string
    name: Path
    users: Member[] | undefined
  } = $props()

  // svelte-ignore state_referenced_locally
  const { form: formData } = form

  let open = $state(false)
  let searchQuery = $state('')
  let triggerRef = $state<HTMLButtonElement | null>(null)

  const selectedUser = $derived(users.find((u) => u.id === ($formData[name] as string)))

  const filteredUsers = $derived(
    searchQuery.trim()
      ? users.filter(
          (u) =>
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : users,
  )

  const closeAndFocusTrigger = () => {
    open = false
    tick().then(() => {
      triggerRef?.focus()
    })
  }
</script>

<Form.Field name={name as unknown as FormPath<T>} {form}>
  <Form.Control>
    {#snippet children({ props: { id, name: controlName, ...attrs } })}
      <Form.Label for={id}>{label}</Form.Label>
      <!-- Hidden input carries the actual user ID for form submission -->
      <input name={controlName} type="hidden" value={($formData[name] as string) ?? ''} />

      <Popover.Root bind:open>
        <Popover.Trigger bind:ref={triggerRef}>
          {#snippet child({ props: popoverProps })}
            <Button
              {...popoverProps}
              {...attrs}
              {id}
              class={cn(
                'w-full justify-between font-normal',
                !selectedUser && 'text-muted-foreground',
              )}
              aria-expanded={open}
              role="combobox"
              type="button"
              variant="outline"
            >
              <span class="flex items-center gap-2 truncate">
                <UserIcon class="size-4 shrink-0 opacity-60" />
                {selectedUser ? (selectedUser.name ?? selectedUser.email) : label}
              </span>
              <ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          {/snippet}
        </Popover.Trigger>

        <Popover.Content class="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command.Root shouldFilter={false}>
            <Command.Input placeholder="Buscar usuario..." bind:value={searchQuery} />
            <Command.List>
              <Command.Empty>No se encontraron usuarios.</Command.Empty>
              <Command.Group>
                {#each filteredUsers as user (user.id)}
                  <Command.Item
                    onSelect={() => {
                      $formData[name] = user.id as unknown as T[Path]
                      closeAndFocusTrigger()
                    }}
                    value={user.id}
                  >
                    <CheckIcon
                      class={cn(
                        'mr-2 size-4',
                        ($formData[name] as string) !== user.id && 'invisible',
                      )}
                    />
                    <span class="flex flex-col">
                      <span class="text-sm font-medium">{user.name ?? user.email}</span>
                      {#if user.name}
                        <span class="text-xs text-muted-foreground">{user.email}</span>
                      {/if}
                    </span>
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
