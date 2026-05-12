<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Button from '$lib/components/ui/button.svelte'
  import * as NativeSelect from '$lib/components/ui/native-select/index'
  import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left'
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
  import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left'
  import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right'

  const {
    pagination,
  }: {
    pagination: { page: number; pageSize: number; totalCount: number; totalPages: number }
  } = $props()

  const updatePage = async (newPage: number) => {
    const url = new URL(page.url)
    url.searchParams.set('page', newPage.toString())
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    await goto(url, { keepFocus: true, noScroll: true })
  }

  const updatePageSize = async (newSize: string) => {
    const url = new URL(page.url)
    url.searchParams.set('pageSize', newSize)
    url.searchParams.set('page', '1') // Reset to first page when page size changes
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    await goto(url, { keepFocus: true, noScroll: true })
  }
</script>

<div class="flex flex-col items-center px-2 py-6 max-sm:gap-4 sm:flex-row sm:justify-between">
  <div class="text-sm text-muted-foreground max-sm:order-last">
    Total de {pagination.totalCount} registros.
  </div>

  <div class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
    <div class="flex items-center space-x-2">
      <p class="text-sm font-medium whitespace-nowrap">Filas por página</p>
      <NativeSelect.Root
        onchange={(e: { currentTarget: { value: string } }) =>
          updatePageSize(e.currentTarget.value)}
        value={pagination.pageSize.toString()}
      >
        <NativeSelect.Option value="10">10</NativeSelect.Option>
        <NativeSelect.Option value="20">20</NativeSelect.Option>
        <NativeSelect.Option value="50">50</NativeSelect.Option>
        <NativeSelect.Option value="100">100</NativeSelect.Option>
      </NativeSelect.Root>
    </div>

    <div class="flex items-center justify-center space-x-2">
      <div class="flex w-25 items-center justify-center text-sm font-medium">
        Página {pagination.page} de {pagination.totalPages}
      </div>

      <div class="flex items-center space-x-1">
        <Button
          class="hidden size-8 p-0 sm:flex"
          disabled={pagination.page <= 1}
          onclick={() => updatePage(1)}
          variant="outline"
        >
          <span class="sr-only">Ir a la primera página</span>
          <ChevronsLeftIcon size={16} />
        </Button>
        <Button
          class="size-8 p-0"
          disabled={pagination.page <= 1}
          onclick={() => updatePage(pagination.page - 1)}
          variant="outline"
        >
          <span class="sr-only">página anterior</span>
          <ChevronLeftIcon size={16} />
        </Button>

        <Button
          class="size-8 p-0"
          disabled={pagination.page >= pagination.totalPages}
          onclick={() => updatePage(pagination.page + 1)}
          variant="outline"
        >
          <span class="sr-only">Ir a la siguiente página</span>
          <ChevronRightIcon size={16} />
        </Button>
        <Button
          class="hidden size-8 p-0 sm:flex"
          disabled={pagination.page >= pagination.totalPages}
          onclick={() => updatePage(pagination.totalPages)}
          variant="outline"
        >
          <span class="sr-only">Ir a la última página</span>
          <ChevronsRightIcon size={16} />
        </Button>
      </div>
    </div>
  </div>
</div>
