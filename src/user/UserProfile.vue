<script setup lang="ts">
import { useAccount, useUser, addProfileField } from '#composables'
import { ref } from 'vue'
import { UserProfileField } from '../components'

const { user } = useUser()

const { account } = useAccount(user.pub)

const newField = ref('')


</script>

<template lang="pug">
.flex.flex-col.p-2.w-full
  .p-2.flex.items-center.gap-2
    .font-bold.text-lg My details
    .flex-1
    slot
  user-profile-field(
    v-for="(d, k) in account.profile" 
    :key="d"
    :field="`${k}`" 
    :content="d")
  .flex.items-center.flex-wrap
    input.p-2.rounded-lg.shadow-md.dark-bg-dark-400(
      v-model="newField" 
      placeholder="New profile field" 
      @keydown.enter="addProfileField(newField)")
    button.m-2.button.items-center.dark-bg-dark-400(@click="addProfileField(newField)")
      .i-la-plus
      .p-1.text-sm Add
</template>