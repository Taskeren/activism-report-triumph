<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LucideLanguages } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const languages = [
  { name: 'English', code: 'en' },
  { name: '简体中文', code: 'zh_cn' },
  { name: '正體中文', code: 'zh_tw' },
]

const setLanguage = (language: string) => {
  locale.value = language
  localStorage.setItem('locale', language)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <header class="border-b px-6 py-4 flex items-center justify-between bg-card sticky top-0 z-50">
      <div class="font-bold text-lg">{{ t('navbar.title') }}</div>
      <nav class="flex gap-4 text-sm items-center">
        <RouterLink to="/" class="hover:underline">{{ t('navbar.homepage') }}</RouterLink>
        <a
          class="hover:underline"
          href="https://github.com/Taskeren/activism-report-triumph"
          target="_blank"
          >GitHub</a
        >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" class="size-9">
              <LucideLanguages></LucideLanguages>
              <span class="sr-only">Toggle Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-32">
            <DropdownMenuItem
              v-for="lang in languages"
              :key="lang.code"
              @click="setLanguage(lang.code)"
              class="cursor-pointer font-sans text-sm"
            >
              {{ lang.name }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>

    <div class="flex-1 flex flex-col">
      <RouterView />
    </div>

    <footer class="border-t py-4 text-center text-xs text-muted-foreground">
      2026 &copy; The Genius Warlock.
    </footer>
  </div>
</template>

<style scoped></style>
