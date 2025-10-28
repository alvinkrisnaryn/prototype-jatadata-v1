import { ref } from 'vue'

export const regionalSummary = {
  jakartaPusat: 350,
  jakartaTimur: 420,
  bekasi: 280,
  totalArea: 1050,
  focusArea: 'Jakarta Timur',
  statusMessage: 'Jakarta Timur menunjukkan pertumbuhan 5% bulan ini',
}

export const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
})

export const allJamaahData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  datasets: [
    {
      label: 'Jumlah Jamaah',
      backgroundColor: '#007bff',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
})

export const statusJamaahData = ref({
  labels: ['Aktif', 'Non-Aktif', 'Baru'],
  datasets: [
    {
      label: 'Status Jamaah',
      backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
      data: [40, 20, 10],
    },
  ],
})

export const jamaahPerKojaData = ref({
  labels: ['Koja A', 'Koja B', 'Koja C', 'Koja D'],
  datasets: [
    {
      label: 'Jumlah Jamaah',
      backgroundColor: '#17A2B8',
      data: [35, 45, 25, 55],
    },
  ],
})

export const pekerjaanData = ref({
  labels: ['Swasta', 'PNS', 'Mahasiswa', 'Petani'],
  datasets: [
    {
      label: 'Jumlah Pekerjaan',
      backgroundColor: '#6f42c1',
      data: [50, 20, 30, 10],
    },
  ],
})
