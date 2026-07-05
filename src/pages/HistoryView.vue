<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { HistoriesResponse2 } from '@/types/response.ts'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useI18n } from 'vue-i18n'
import { useFetch, useTitle } from '@vueuse/core'
import { ArrowUp } from '@lucide/vue'

type UserGameData = HistoriesResponse2

const route = useRoute()
const title = useTitle()

const scrollUpVisible = ref(false)
const checkScrollUpVisibility = () => {
  scrollUpVisible.value = window.scrollY > 300
}
const scrollUp = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScrollUpVisibility)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollUpVisibility)
})

const { type, id } = route.params
const {
  data: dataW,
  isFetching: loading,
  execute: reloadData,
} = useFetch(`https://activisme.nitu2003.workers.dev/api/get-history2/${type}/${id}`).json<{
  data: UserGameData
}>()
const gameData = computed(() => dataW.value?.data)

const BUNGIE_URL = 'https://www.bungie.com'

const emblemStyle = computed(() => {
  const emblem = gameData.value?.emblemDefinition?.secondarySpecial
  const url = emblem ? `${BUNGIE_URL}${emblem}` : undefined
  return url ? { 'background-image': `url('${url}')` } : undefined
})

const emblemOverlay = computed(() => {
  const emblem = gameData.value?.emblemDefinition?.secondaryOverlay
  const url = emblem ? `${BUNGIE_URL}${emblem}` : undefined
  return url ? { 'background-image': `url('${url}')` } : undefined
})

const displayName = computed(() => {
  const d = gameData.value?.userInfo
  return d
    ? `${d.bungieGlobalDisplayName}#${d.bungieGlobalDisplayNameCode?.toString()?.padStart(4, '0')}`
    : undefined
})

watch(displayName, (name) => {
  title.value = name ?? t('navbar.title')
})

const { t } = useI18n()

const activityName = (hash: number) => {
  return t(`activity_name.${hash}`)
}

const completeText = (k: string) => {
  return t(`complete.${k}`)
}

const highlightText = (k: string) => {
  return t(`highlight.${k}`)
}

const periodText = (p: string) => {
  const period = new Date(p)
  const timeElapsed = new Date().getTime() - period.getTime()

  let time = timeElapsed / 1000
  if (time < 60) return t('time.seconds_ago', [time.toFixed(0)])
  time = time / 60
  if (time < 60) return t('time.minutes_ago', [time.toFixed(0)])
  time = time / 60
  if (time < 24) return t('time.hours_ago', [time.toFixed(0)])
  time = time / 24
  if (time < 7) return t('time.days_ago', [time.toFixed(0)])
  time = time / 7
  return t('time.weeks_ago', [time.toFixed(0)])
}
</script>

<template>
  <header class="bg-cover flex flex-wrap items-center gap-3" :style="emblemStyle">
    <div class="max-w-lg flex flex-wrap mx-auto my-4 gap-x-2">
      <span
        class="inline-block bg-cover size-12"
        :class="{ 'animate-spin': loading }"
        :style="emblemOverlay"
        @click="reloadData()"
      ></span>
      <h2 class="text-3xl font-bold my-auto text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        {{ displayName }}
      </h2>
    </div>
  </header>

  <main
    v-if="gameData?.histories && gameData.histories.length > 0"
    class="flex-1 gap-4 px-6 w-sm md:w-2xl mx-auto"
  >
    <Collapsible
      v-for="(group, groupIndex) in gameData?.histories"
      :key="groupIndex"
      class="flex flex-col py-4 border-b hover:bg-zinc-100 group"
    >
      <CollapsibleTrigger asChild>
        <div class="flex flex-col md:flex-row items-center p-4 cursor-pointer">
          <h3 class="flex-1 text-2xl font-bold">{{ activityName(group.hash) }}</h3>
          <div class="flex flex-wrap md:w-[20%] md:grid md:grid-cols-2 gap-x-4 gap-y-2">
            <template
              v-for="([completeType, completeData], completeIndex) in Object.entries(
                group.completion,
              )"
              :key="completeIndex"
            >
              <div class="flex items-center gap-1.5 whitespace-nowrap text-sm md:contents">
                <span class="md:justify-self-end">{{ completeText(completeType) }}</span>
                <span class="md:justify-self-start">x{{ completeData.count }}</span>
              </div>
              <div
                v-for="([completeReason, count], reasonIndex) in Object.entries(
                  completeData.reasons,
                )"
                :key="reasonIndex"
                class="flex items-center gap-1.5 whitespace-nowrap text-sm md:contents"
              >
                <span class="md:justify-self-end text-zinc-400">
                  {{ completeText(completeReason) }}</span
                >
                <span class="md:justify-self-start text-zinc-400">x{{ count }}</span>
              </div>
            </template>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        class="flex flex-col gap-4 divide-y text-zinc-400 group-hover:text-zinc-900"
      >
        <div
          v-for="(activity, activityIndex) in group.activities"
          :key="activityIndex"
          class="grid grid-cols-[20%_1fr_30%_20%] items-center p-4"
        >
          <span class="text-center">{{ periodText(activity.period) }}</span>
          <component
            :is="activity.targetUrl ? 'a' : 'h4'"
            :href="activity.targetUrl || undefined"
            :target="activity.targetUrl ? '_blank' : undefined"
            class="text-center"
            :class="
              activity.targetUrl
                ? 'text-sky-300 group-hover:text-sky-600 hover:underline'
                : undefined
            "
          >
            {{ activityName(activity.hash) }}
          </component>
          <div class="flex flex-wrap gap-1 items-center justify-center text-xs">
            <div
              v-for="(highlight, highlightIndex) in activity.highlights"
              :key="highlightIndex"
              class="inline-flex items-center select-none leading-none"
            >
              <span
                v-if="typeof highlight === 'string'"
                class="bg-linear-to-b from-[#4bc51d] to-[#3ca014] text-white whitespace-nowrap px-2 py-1"
              >
                {{ highlightText(highlight) }}</span
              >
              <template v-else>
                <span
                  class="bg-linear-to-b from-[#555] to-[#444] text-white whitespace-nowrap px-2 py-1 border-r border-black/10"
                >
                  {{ highlightText(highlight[0]) }}</span
                >
                <span
                  class="bg-linear-to-b from-[#4bc51d] to-[#3ca014] text-white whitespace-nowrap px-2 py-1"
                >
                  {{ highlight[1] }}</span
                >
              </template>
            </div>
          </div>
          <span class="text-center">
            {{ completeText(activity.completionType) }}
            <template v-if="activity.completionReason">
              {{ completeText(activity.completionReason) }}</template
            >
          </span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </main>
  <main v-else-if="loading" class="flex-1 flex items-center justify-center">
    <h1 class="text-4xl font-bold">{{ t('message.loading') }}</h1>
  </main>
  <main v-else class="flex-1 flex items-center justify-center">
    <h1 class="text-4xl font-bold">{{ t('message.history_data_empty') }}</h1>
  </main>

  <button
    @click="scrollUp"
    class="fixed bottom-6 right-6 z-50 p-3 bg-zinc-900 text-white rounded-full shadow-lg hover:bg-zinc-800 transition-all duration-300 cursor-pointer flex items-center justify-center group"
    :class="
      scrollUpVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    "
  >
    <ArrowUp class="size-5 transition-transform group-hover:-translate-y-0.5" />
  </button>
</template>

<style scoped></style>
