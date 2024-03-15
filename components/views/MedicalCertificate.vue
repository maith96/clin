<template>
  <div id="medical-certificate" ref="pdfSection" class="container mx-auto p-6 max-w-[550px]  border border-2 border-gray-300 bg-white mt-10">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold">
        {{ hospitalName }} Hospital/Clinic
      </h1>
      <h3 class="text-xl">
        Medical Certificate
      </h3>
    </div>
    <div class="max-w[70%]">
      <div class=" p-2 flex">
        <strong class=" p-2">Name:</strong> <span class=" p-2">{{ report.data?.patient.user.firstName }} {{ report.data?.patient.user.middleName }} {{ report.data?.patient.user.lastName }}</span>
      </div>
      <div class=" p-1 flex">
        <strong class=" p-2">Sex:</strong><span class=" p-2">{{ report.data?.patient.user.gstarter }}</span>
      </div>
      <div class=" p-2 flex">
        <strong class=" p-2">ID No.:</strong> <span class=" p-2">{{ report.data?.patient.user.nationalIdNumber }}</span>
      </div>

      <div class="m-0 flex justify-between">
        <div class=" p-2 flex">
          <strong class=" p-2">Age:</strong> <span class=" p-2">{{ report.data?.patient.user.age }}</span>
        </div>
      </div>
      <div class=" p-2 flex">
        <strong class=" p-2">Contact:</strong> <span class=" p-2">{{ report.data?.patient.user.contactNumber }}</span>
      </div>
      <div class=" p-2 flex">
        <strong class=" p-2">Address:</strong> <span class=" p-2">{{ report.data?.patient.user.address }}</span>
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
          <strong class=" p-2">Doctor Signature:</strong> <span class=" p-2">{{ `${report.data?.doctor.user.lastName}` }}</span>
        </div>
      </div>
    </div>
    <UButton label="Download pdf" @click="exportToPDF('report.pdf', pdfSection, {orientation:'landscape'}, {x: 20, y: 10, windowWidth:400})" />
  </div>
</template>

<script lang="ts" setup>

const pdfSection = ref<HTMLElement | null>(null)
const { id } = useRoute().params
const { $client } = useNuxtApp()

const report = ref(await $client.reports.get.useQuery({ id: id as string }))
</script>

<style scoped>

</style>
