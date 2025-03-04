import worker from "./worker.js?worker&inline";
import { useWebWorker } from "@vueuse/core";
import { watch } from "vue";

const GunWorker = useWebWorker(worker);

GunWorker.post({ message: "Worker post check up" });

watch(GunWorker.data, (d) => console.log("Recieved:", d), { immediate: true });

export default GunWorker;
