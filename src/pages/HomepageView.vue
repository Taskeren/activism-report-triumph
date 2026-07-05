<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { computed, ref } from 'vue'
import type { UserInfoCard } from '@taskeren/bungie-api-ts/user'
import { refDebounced, useFetch, useTitle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
useTitle().value = t('navbar.title')

const username = ref('')
const showCandidates = ref(false)

const debouncedUsername = refDebounced(username, 300)
const payload = computed(() =>
  debouncedUsername.value ? JSON.stringify(debouncedUsername.value) : undefined,
)
const {
  data: candidatesW, // w = wrapped
  isFetching: isLoading,
} = useFetch('https://activisme.nitu2003.workers.dev/api/search-user?main=1', {
  refetch: true,
  immediate: false,
  beforeFetch({ cancel }) {
    // don't send if value is not ready
    if (!payload.value) {
      cancel()
    }
  },
})
  .post(payload)
  .json<{ data: UserInfoCard[] }>()
const candidates = computed(() => candidatesW.value?.data)

const normalizedName = (card: UserInfoCard) => {
  const name = card.bungieGlobalDisplayName
  const code = (card.bungieGlobalDisplayNameCode ?? -1).toString()
  return name + '#' + code.padStart(4, '0')
}
</script>

<template>
  <div
    class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full"
  >
    <div class="w-full max-w-xl relative">
      <div class="flex w-full items-center space-x-2">
        <Input
          type="search"
          id="username"
          class="bg-white text-center placeholder:text-center"
          placeholder="MyBungieName#1234"
          v-model="username"
          @focus="showCandidates = true"
          @blur="showCandidates = false"
        />
      </div>
      <div
        v-show="showCandidates && username.length > 0"
        class="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto z-50 py-1"
      >
        <div v-if="isLoading" class="p-4 text-center text-xs text-gray-400">
          {{ t('message.loading') }}
        </div>
        <div
          v-else-if="candidates && candidates.length === 0"
          class="p-4 text-center text-xs text-gray-400"
        >
          {{ t('message.user_list_empty') }}
        </div>
        <ul v-else>
          <li
            v-for="user in candidates"
            :key="user.membershipType + '.' + user.membershipId"
            class="px-4 py-2 text-sm flex justify-between items-center text-gray-700 bg-gray-50 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors"
            @mousedown="
              $router.push({
                name: 'history',
                params: { id: user.membershipId, type: user.membershipType },
              })
            "
          >
            <span class="font-medium">{{ normalizedName(user) }}</span>
            <span class="text-xs opacity-60">@{{ user.displayName }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
