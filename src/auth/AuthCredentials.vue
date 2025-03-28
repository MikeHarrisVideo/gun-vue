<script setup lang="ts">
import { useUser, downloadFile, useAuth } from '#composables'
import { AuthPass, QrShow } from '../components'
import { ref, computed } from 'vue'
import { useClipboard, useShare } from '@vueuse/core'

const emit = defineEmits(['close'])

const current = ref('pass')

const { user } = useUser()

function show(option) {
  if (current.value != option) {
    current.value = option;
  } else {
    current.value = null;
  }
}

const { pass } = useAuth()


const { text, copy, copied, isSupported: canCopy } = useClipboard()
const { share, isSupported: canShare } = useShare()

const safePair = ref(true)

const encPair = computed(() => {
  return safePair.value ? pass?.safe?.enc : JSON.stringify(user.pair())
});

const href = computed(() => safePair.value ? pass.links.pass : pass.links.pair)

</script>

<template lang="pug">
.flex.flex-col.items-stretch.pb-4.border-1.border-dark-100.border-opacity-10.max-w-120.mx-auto.dark-bg-dark-200(v-if="user.is" :key="user.is")
  .mt-4.mx-6 Please make sure to safely store your cryptographic keypair to be able to use it again later
  auth-pass
  .flex.p-4.items-center.bg-dark-100.bg-opacity-20.mt-2.shadow-inset(v-if="pass?.safe?.enc")
    .flex.flex-col.w-34.items-center(:style="{ color: safePair ? 'green' : 'red' }")
      button.m-2.button.text-2xl(@click="safePair = !safePair")
        .i-la-lock(v-if="safePair")
        .i-la-unlock(v-else)
      .text-sm {{ safePair ? 'Encrypted' : 'Plain Text' }}
      .text-m Key Pair
    .flex.flex-wrap
      button.m-2.button.items-center(
        v-if="canShare" 
        :class="{ active: current == 'pass' }" 
        @click="share({ title: 'Your key pair', text: encPair })"
        )
        .i-la-share
        .px-1 Share
      button.m-2.button.items-center(
        v-if="canCopy" 
        @click="copy(encPair)"
        )
        .i-la-copy
        transition(name="fade" mode="out-in" appear)
          .px-2(v-if="copied") Copied!
          .px-2(v-else) Copy
      a.m-2.button.items-center(
        :href="href" 
        target="_blank" 
        @click="show('links')" 
        )
        .i-la-link
        .px-2 Link
      button.m-2.button.items-center(@click="show('qr')")
        .i-la-qrcode
        .px-2 QR
      button.m-2.button.items-center(@click="show('key')")
        .i-la-envelope-open-text
        .px-2 Text
      button.m-2.button.items-center(@click="downloadFile(encPair, 'text/json', (user.name || 'account') + '.json', false); current = null")
        .i-la-file-code
        .px-2 JSON
  .flex.w-full.justify-center.mt-4(v-if="current")
    transition-group(name="fade")
      textarea.p-4.text-sm.flex-1.rounded-xl(
        v-if="current == 'key'",
        key="text",
        rows="9",
        :value="encPair"
      )
      qr-show.max-w-600px(
        v-if="current == 'qr'" 
        key="qr" 
        :data="safePair ? pass.links.pass : pass.links.pair"
        )
  slot
</template>

<style scoped></style>