<script setup>
import { useRoom, useUser, useRoomLogo, currentRoom } from '#composables'
import { FormPicture } from '../components'

const { room, updateRoomProfile } = useRoom()
const { user } = useUser()

const props = defineProps({
  pub: { type: String, default: currentRoom.pub },
  size: { type: Number, default: 120 },
  pic: { type: Number, default: 200 }
})

const { logo, uploadLogo, removeLogo } = useRoomLogo(props.pub)


</script>

<template lang="pug">
.flex.flex-col.relative.items-center.justify-center
  img(:src="logo || 'https://gun-vue.js.org/media/gun-vue-logo.svg'")

  form-picture.absolute.z-100000(
    v-if="room.hosts[user.pub]"
    :options="{ picSize: props.pic, preserveRatio: false }"
    @update="uploadLogo($event)"
    )
    .text-2xl
      .i-la-camera(v-if="!logo")
      .i-la-trash-alt(
        v-else 
      @click.stop.prevent="removeLogo()"
      )
</template>