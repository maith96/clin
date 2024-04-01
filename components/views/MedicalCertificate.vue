<template>
  <div>
    <div id="medical-certificate" ref="pdfSection" class="container mx-auto p-6 max-w-[550px]  border border-2 border-gray-300 bg-white mt-10">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">
          Clinic Management System
        </h1>
        <h3 class="text-xl">
          Medical Certificate
        </h3>
      </div>
      <div class="max-w[70%]">
        <div class="flex justify-between items-center">
          <div class=" p-2 flex">
            <strong class=" p-2">Name:</strong> <span class=" p-2">{{ report.data?.patient.user.firstName }} {{ report.data?.patient.user.middleName }} {{ report.data?.patient.user.lastName }}</span>
          </div>
          <div class=" p-1 flex">
            <strong class=" p-2">Sex:</strong><span class=" p-2">{{ report.data?.patient.user.gender }}</span>
          </div>
          <div class="m-0 flex justify-between">
            <div class=" p-2 flex">
              <strong class=" p-2">Age:</strong> <span class=" p-2">{{ report.data?.patient.user.age }}</span>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div class=" p-2 flex">
            <strong class=" p-2">ID No.:</strong> <span class=" p-2">{{ report.data?.patient.user.nationalIdNumber }}</span>
          </div>
        </div>
        <div class=" p-2 flex">
          <strong class=" p-2">Contact:</strong> <span class=" p-2">{{ report.data?.patient.user.contactNumber }}</span>
        </div>
        <div class="m-0 flex justify-between">
          <div class=" p-2 flex">
            <strong class=" p-2">Illness:</strong> <span class=" p-2">{{ report.data?.illness }}</span>
          </div>
        </div>

        <div class="m-0 flex justify-between">
          <div class=" p-2 flex">
            <strong class=" p-2">Symptoms:</strong> <span class=" p-2">{{ report.data?.symptoms }}</span>
          </div>
        </div>
        <div class="m-0 flex justify-between">
          <div class=" p-2 flex">
            <strong class=" p-2">Prescription:</strong> <span class=" p-2">{{ report.data?.prescription }}</span>
          </div>
        </div>

        <div class="m-0 flex justify-between">
          <div class=" p-2 flex">
            <strong class=" p-2">Date of Examination:</strong> <span class=" p-2">{{ onlyDateTime(report.data?.dateTime) }}</span>
          </div>
        </div>

        <div class="m-0 flex justify-start">
          <div class=" p-2 flex">
            <strong class=" p-2">Doctor:</strong> <span class=" p-2">{{ report.data?.doctor.user.firstName }} {{ report.data?.doctor.user.middleName }} {{ report.data?.doctor.user.lastName }}</span>
          </div>
        </div>

        <!-- <div class="m-0 flex justify-start">
        <div class=" p-2 flex">
          <strong class=" p-2">Doctor Key:</strong> <span class=" p-2">{{ report.data?.doctorId }}</span>
        </div>
      </div> -->
        <div class="m-0 flex justify-start">
          <div class=" p-2 flex">
            <strong class=" p-2">Doctor Signature:</strong>
            <div>
              <img :src="url.length > 1? url: report.data?.doctor.signature">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto p-6 max-w-[550px]  border border-2 border-gray-300 bg-white mt-10">
      <UFormGroup v-if="userStore.user?.role === 'doctor'" label="Signature" name="signature">
        <UInput type="file" size="sm" @change="onFileChange" />
      </UFormGroup>
      <UButton label="Download pdf" @click="exportToPDF('report.pdf', pdfSection, {orientation:'landscape'}, {x: 20, y: 10, windowWidth:400})" />
    </div>
  </div>
</template>

<script lang="ts" setup>

const pdfSection = ref<HTMLElement | null>(null)
const { id } = useRoute().params
const { $client } = useNuxtApp()

const report = ref(await $client.reports.get.useQuery({ id: id as string }))

const url = ref<string>('')
async function onFileChange (e: any) {
  const file = e.target.files[0]
  // url.value = URL.createObjectURL(file)
  const fr = new FileReader()
  fr.onload = function () {
    url.value = fr.result as string
  }
  fr.readAsDataURL(file)
  await $client.doctors.updateSignature.mutate({ id: report.value.data?.doctorId as string, signature: url.value as string })
}

const userStore = useUserStore()
</script>

<style scoped>

</style>
